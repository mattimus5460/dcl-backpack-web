import {NextApiRequest, NextApiResponse} from "next";
import {Item, NFT} from '@dcl/schemas'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { params } = req.query

    if (!params || !params[0]){
        res.status(400).json({ err: 'userId is a required parameter' });
        return
    }

    if (req.method === 'GET') {

        if(params[1] && params[1] === "wearing") {
            const wearables = await fetchPlayerDataProfileWearables(params[0])
            res.status(200).json(wearables);
        } else {
            const wearables = await fetchAllPlayerWearables(params[0])
            res.status(200).json(wearables);
        }


    } else {
        // Handle any other HTTP method
    }
}


export async function fetchPlayerDataProfileAvatar(userId: string | string[]) {
    //const userData = await getUserData()
    //const playerRealm = await getCurrentRealm()

    let url = `https://peer.decentraland.org/lambdas/profile/${userId}`.toString()

    try {
        let response = await fetch(url,
            { headers: {
                    'Cache-Control': 'no-cache'
                }})
        let json = await response.json()

        console.log("player avatar:", json.avatars[0])
        return json.avatars[0]
    } catch {
        console.log("an error occurred while reaching for player data")
    }
}


export async function fetchPlayerDataProfileSnapshot(userId: string | string[]) {
    //const userData = await getUserData()
    //const playerRealm = await getCurrentRealm()

    let url = `https://peer.decentraland.org/lambdas/profile/${userId}`.toString()

    try {
        let response = await fetch(url,
            { headers: {
                    'Cache-Control': 'no-cache'
                }})
        let json = await response.json()

        console.log("player snapshot:", json.avatars[0].avatar.snapshots.face256)
        return json.avatars[0].avatar.snapshots.face256
    } catch {
        console.log("an error occurred while reaching for player data")
    }
}


export async function fetchPlayerDataProfileWearables(userId: string | string[]) {
    //const userData = await getUserData()
    //const playerRealm = await getCurrentRealm()

    let url = `https://peer.decentraland.org/lambdas/profile/${userId}`.toString()

    try {
        let response = await fetch(url,
            { headers: {
                    'Cache-Control': 'no-cache'
                }})
        let json = await response.json()

        console.log("full response: ", json)
        console.log("player is wearing:", json.avatars[0].avatar.wearables)
        return json.avatars[0].avatar.wearables
    } catch {
        console.log("an error occurred while reaching for player data")
    }
}

export async function fetchAllPlayerWearables(userId: string | string[]) {
    //const userData = await getUserData()
    //const playerRealm = await getCurrentRealm()

    let url = `https://peer.decentraland.org/lambdas/collections/wearables-by-owner/${userId}?includeDefinitions`.toString()

    try {
        let response = await fetch(url,
            { headers: {
                    'Cache-Control': 'no-cache'
                }})
        let json = await response.json()

        console.log("player owns:", json)
        return json
    } catch {
        console.log("an error occurred while reaching for player data")
    }
}

const nftApiByEnv = `https://nft-api.decentraland.org`

class NFTApi {
    async fetchItem(contractAddress: string, itemId: string) {
        const { data } = await json<{ data: Item[] }>(`${nftApiByEnv}/v1/items?contractAddress=${contractAddress}&itemId=${itemId}`)
        if (data.length === 0) {
            throw new Error(`Item not found for contractAddress="${contractAddress}" itemId="${itemId}"`)
        }
        return data[0]
    }
    async fetchNFT(contractAddress: string, tokenId: string) {
        const { data } = await json<{ data: { nft: NFT }[] }>(
            `${nftApiByEnv}/v1/nfts?contractAddress=${contractAddress}&tokenId=${tokenId}`
        )
        if (data.length === 0) {
            throw new Error(`NFT not found for contractAddress="${contractAddress}" tokenId="${tokenId}"`)
        }
        return data[0].nft
    }
}

export const nftApi = new NFTApi()


export async function json<T>(url: string, attempts = 3): Promise<T> {
    try {
        const resp = await fetch(url)
        if (!resp.ok) {
            throw new Error(await resp.text())
        }
        return resp.json() as Promise<T>
    } catch (error) {
        if (attempts > 0) {
            await sleep(100)
            return json(url, attempts - 1)
        } else {
            throw error
        }
    }
}

export async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export const getWearableInfo = async (wearable:string) => {
    const splitId = wearable.split(':')
    const collection = splitId[3]
    const contract = splitId[4]
    const itemId = splitId[5]

    if (collection === 'collections-v2') {
        const itemResp = await nftApi.fetchItem(contract, itemId)

        console.log("item response: ", itemResp)
        return itemResp
    }
}