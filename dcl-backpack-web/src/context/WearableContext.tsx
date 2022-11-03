import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react'
import {fetchPlayerDataProfileAvatar, getWearableInfo} from "../../pages/api/wearables/[...params]";
import {Item} from "@dcl/schemas";
import {useWeb3Context} from "./Web3Context";

const wearableInitialState: WearableProviderState = {
    currentlyWearing: [],
    currentlyWearingData: [],
    currentlyWearingMap: new Map(),
    setCurrentlyWearing: () => {
    },
    updateCurrentlyWearing: () => {
    },
    profile: {name: '', snapshot: ''}
}

interface WearableProviderState {
    currentlyWearing: string[]
    currentlyWearingData: Item[] | null | undefined
    currentlyWearingMap: Map<string, CurrentlyWearingContextProps | undefined>
    setCurrentlyWearing: Function
    updateCurrentlyWearing: Function
    profile: AvatarProfile
}

interface AvatarProfile {
    name: string
    snapshot: string
}

const WearableContext = createContext<WearableProviderState>(wearableInitialState)

interface Props {
    children: ReactNode
}

export interface CurrentlyWearingContextProps {
    category: string
    name: string
    thumbnail: string
    rarity: string
    urn: string
}

export const WearableContextProvider = ({children}: Props) => {
    const {address: avatarAddress} = useWeb3Context()

    const [currentlyWearingUrns, setCurrentlyWearingUrns] = useState<string[]>([])
    const [currentlyWearingData, setCurrentlyWearingData] = useState<Item[]>([])
    const [currentlyWearingMap, setCurrentlyWearingMap] = useState<Map<string, CurrentlyWearingContextProps | undefined>>(new Map())
    const [profile, setProfile] = useState<AvatarProfile>({name: '', snapshot: ''})

    const updateCurrentlyWearing = (category: string, urn: string, name: string, thumbnail: string, rarity: string) => {

        const updatedMap = new Map(currentlyWearingMap.set(category, {category, name, thumbnail, rarity, urn}))

        setCurrentlyWearingMap(updatedMap)

        let curUrns: string[] = []
        console.log(updatedMap)

        updatedMap.forEach((v) => {
            if (!v) return
            curUrns.push(v.urn)
        })


        console.log(curUrns)
        setCurrentlyWearingUrns(curUrns)
    }

    useEffect(() => {
        if (!avatarAddress) {
            setProfile({name: '', snapshot: ''})
            setCurrentlyWearingUrns([])
            setCurrentlyWearingData([])
            return
        }

        fetchPlayerDataProfileAvatar(avatarAddress)
            .then((profile) => {
                setCurrentlyWearingUrns(profile.avatar.wearables)
                setProfile({snapshot: profile.avatar.snapshots.face256, name: profile.name})
            })
    }, [avatarAddress])


    interface cw {
        urn: string;
        item: Item | undefined
    }

    useEffect(() => {

        if (!currentlyWearingUrns)
            return

        const fetchWearableInfo: (urn: string) => Promise<cw> = async (urn: string) => {
            return {urn, item: await getWearableInfo(urn)}
        }

        const allWearables: Promise<cw>[] =
            currentlyWearingUrns.map((urn) => {
                return fetchWearableInfo(urn)
            })

        Promise.all(allWearables).then((data) => {
            setCurrentlyWearingMap(
                new Map(
                    data.map(obj => {
                        if (!obj || !obj.item || !obj.item.data.wearable)
                            return ['not-found', {name: '', category: '', thumbnail: '', rarity: '', urn: ''}]
                        return [obj.item.data.wearable.category.toString(),
                            {
                                category: obj.item.data.wearable.category,
                                name: obj.item.name,
                                thumbnail: obj.item.thumbnail,
                                rarity: obj.item.rarity,
                                urn: obj.urn
                            }];
                    })));
        })
    }, [currentlyWearingUrns])

    return (
        <WearableContext.Provider value={{
            currentlyWearing: currentlyWearingUrns,
            currentlyWearingData,
            currentlyWearingMap,
            setCurrentlyWearing: setCurrentlyWearingUrns,
            updateCurrentlyWearing,
            profile
        }}>
            {children}
        </WearableContext.Provider>
    )

}

export function useWearableContext() {
    return useContext(WearableContext)
}