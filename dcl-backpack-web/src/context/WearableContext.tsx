import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react'
import {useWeb3} from '../hooks/Web3Client'
import {
    fetchPlayerDataProfileAvatar,
    fetchPlayerDataProfileSnapshot,
    fetchPlayerDataProfileWearables,
    getWearableInfo
} from "../../pages/api/wearables/[...params]";
import {Item} from "@dcl/schemas";
import {useWeb3Context} from "./Web3Context";

const wearableInitialState: WearableProviderState = {
    currentlyWearing: [],
    currentlyWearingData: [],
    setCurrentlyWearing: () => {
    },
    profile: {name: '', snapshot: ''}
}

interface WearableProviderState {
    currentlyWearing: string[]
    currentlyWearingData: Item[] | null | undefined
    setCurrentlyWearing: Function
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

export const WearableContextProvider = ({children}: Props) => {
    const {address: avatarAddress} = useWeb3Context()

    const [currentlyWearing, setCurrentlyWearing] = useState<string[]>([])
    const [currentlyWearingData, setCurrentlyWearingData] = useState<Item[]>([])
    const [profile, setProfile] = useState<AvatarProfile>({name:'',snapshot:''})


    useEffect(() => {
        if (!avatarAddress){
            setProfile({name:'',snapshot:''})
            setCurrentlyWearing([])
            setCurrentlyWearingData([])
            return
        }

        fetchPlayerDataProfileAvatar(avatarAddress)
            .then((profile) => {
                setCurrentlyWearing(profile.avatar.wearables)
                setProfile({snapshot: profile.avatar.snapshots.face256, name: profile.name})
            })
    }, [avatarAddress])

    useEffect(() => {

        if (!currentlyWearing)
            return

        const fetchWearableInfo = async (urn: string) => {
            return await getWearableInfo(urn)
        }

        const allWearables: Promise<Item | undefined>[] = currentlyWearing.map((urn) => {
            return fetchWearableInfo(urn)
        })

        // @ts-ignore
        Promise.all(allWearables).then(setCurrentlyWearingData)

    }, [currentlyWearing])

    return (
        <WearableContext.Provider value={{currentlyWearing, currentlyWearingData, setCurrentlyWearing, profile}}>
            {children}
        </WearableContext.Provider>
    )

}

export function useWearableContext() {
    return useContext(WearableContext)
}