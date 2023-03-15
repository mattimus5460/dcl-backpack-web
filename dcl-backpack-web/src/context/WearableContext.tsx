import React, {createContext, PropsWithChildren, useContext, useEffect, useState} from 'react'
import {
    fetchPlayerDataProfileAvatar,
    fetchPlayerDataProfileAvatar2,
    getWearableInfo,
} from "../../pages/api/wearables/[...params]";
import {Item, WearableId} from "@dcl/schemas";
import {useWeb3Context} from "./Web3Context";
import {Avatar, Snapshots} from "@dcl/schemas/dist/schemas";
import {Color3} from "@dcl/schemas/dist/misc";

const wearableInitialState: WearableProviderState = {
    currentlyWearing: [],
    currentlyWearingData: [],
    currentlyWearingMap: new Map(),
    setCurrentlyWearing: () => {
    },
    updateCurrentlyWearing: () => {
    },
    removeCategoryItem: () => {
    },
    profile: {name:''}
}

interface WearableProviderState {
    currentlyWearing: string[]
    currentlyWearingData: Item[] | null | undefined
    currentlyWearingMap: Map<string, CurrentlyWearingContextProps | undefined>
    setCurrentlyWearing: Function
    updateCurrentlyWearing: Function
    removeCategoryItem: Function
    profile: AvatarProfile
}

interface AvatarProfile {
    name: string
    snapshots?: Snapshots
    avatar?: Avatar
}

const WearableContext = createContext<WearableProviderState>(wearableInitialState)

export interface CurrentlyWearingContextProps {
    category: string
    name: string
    thumbnail: string
    rarity: string
    urn: string
}

export interface OutfitMap {
    [category: string]: CurrentlyWearingContextProps
}

export const WearableContextProvider = ({children}: PropsWithChildren) => {
    const {address: avatarAddress} = useWeb3Context()

    const [currentlyWearingUrns, setCurrentlyWearingUrns] = useState<string[]>([])
    const [currentlyWearingData, setCurrentlyWearingData] = useState<Item[]>([])
    const [currentlyWearingMap, setCurrentlyWearingMap] = useState<Map<string, CurrentlyWearingContextProps | undefined>>(new Map())
    const [profile, setProfile] = useState<AvatarProfile>({name:''})

    const updateCurrentlyWearing = (category: string, urn: string, name: string, thumbnail: string, rarity: string) => {
        const updatedMap = new Map(currentlyWearingMap.set(category, {category, name, thumbnail, rarity, urn}))
        setCurrentlyWearingMap(updatedMap)
    }

    const removeCategoryItem = (category: string) => {
        console.log("delete")
        currentlyWearingMap.delete(category)
        setCurrentlyWearingMap(new Map(currentlyWearingMap))

    }

    useEffect(() => {
        if (!avatarAddress) {
            setProfile({name:''})
            setCurrentlyWearingUrns([])
            setCurrentlyWearingData([])
            return
        }

        fetchPlayerDataProfileAvatar2(avatarAddress)
            .then((profile) => {

                console.log(profile)
                if(!profile)
                    return;

                setProfile(profile)
                console.log(profile)

                const currentWearablesUrns: WearableId[] = profile.avatar.avatar.wearables;
                console.log("cwurn" +currentWearablesUrns)
                if (!currentWearablesUrns)
                    return

                setCurrentlyWearingUrns(currentWearablesUrns)

                const fetchWearableInfo: (urn: string) => Promise<cw> = async (urn: string) => {
                    return {urn, item: await getWearableInfo(urn)}
                }

                const allWearables: Promise<cw>[] =
                    currentWearablesUrns.map((urn) => {
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
            })
    }, [avatarAddress])


    useEffect(() => {
        let curUrns: string[] = []

        currentlyWearingMap.forEach((v) => {
            if (!v) return
            curUrns.push(v.urn)
        })

        console.log(curUrns)
        setCurrentlyWearingUrns(curUrns)
    }, [currentlyWearingMap])


    interface cw {
        urn: string;
        item: Item | undefined
    }


    return (
        <WearableContext.Provider value={{
            currentlyWearing: currentlyWearingUrns,
            currentlyWearingData,
            currentlyWearingMap,
            setCurrentlyWearing: setCurrentlyWearingMap,
            updateCurrentlyWearing,
            removeCategoryItem,
            profile
        }}>
            {children}
        </WearableContext.Provider>
    )

}

export function useWearableContext() {
    return useContext(WearableContext)
}
