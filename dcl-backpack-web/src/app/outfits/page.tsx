'use client'
import type {NextPage} from 'next'
import styles from '../../styles/Home.module.css'
import React, {useEffect, useState} from "react";
import {Grid2 as Grid} from "@mui/material";
import {useWeb3Context} from "@/context/Web3Context";
import PreviewFrame from "@/components/wearables/PreviewFrame";
import {OutfitMap, useWearableContext} from "@/context/WearableContext";
import CurrentlyWearing from "@/components/wearables/CurrentlyWearing";
import OutfitList from "@/components/wearables/OutfitList";
import {fetchPlayerDataOutfits} from "../api/wearables/[...params]";

const Outfits: NextPage = () => {

    const [data, setData] = useState(null)
    const [dataSorted, setDataSorted] = useState<Map<string, any> | null>(null)
    const [isLoading, setLoading] = useState(false)
    const [previewUrns, setPreviewUrns] = useState<string[]>([])
    const [backpackAddress, setBackpackAddress] = useState<string | undefined>()

    const [outfits, setOutfits] = useState<OutfitMap[]>([])

    const {address: avatarAddress} = useWeb3Context()
    const {currentlyWearing, setCurrentlyWearing, lambdaOutfits} = useWearableContext()

    useEffect(() => {
        if (!avatarAddress) return

        // Retrieve all outfits
        const response = fetch(`https://us-central1-dcl-closet.cloudfunctions.net/api/outfits/${avatarAddress}`, {
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(res => {
                if (res.ok)
                    return res.json()
                else
                    throw new Error("bad res")
            })
            .then((r) => {
                const outfits = r.map((doc: { outfit: any; }) => {
                    return doc.outfit
                })
                setOutfits(outfits)
            })
            .catch(e => {
                console.log(e)
            });
    }, [avatarAddress])

    return (
        <Grid alignItems={'center'} container size={12}>

            <Grid size={.25}>
            </Grid>
            <Grid size={3}>
                {avatarAddress && <PreviewFrame avatarAddress={avatarAddress} height={'800px'}/>}

                <div className={styles.grid}>
                    <CurrentlyWearing cardSize={2} showUpdate={true}/>
                </div>
            </Grid>
            <Grid size={1}>
            </Grid>

            <Grid container  size={7}>

                <Grid container  size={12}>
                    <h2>In-World Outfits</h2>
                </Grid>

                <Grid container  size={12}>

                    <OutfitList outfitList={lambdaOutfits} setCurrentlyWearing={setCurrentlyWearing}/>
                </Grid>
                <Grid container  size={12}>
                    <h2>Saved Outfits</h2>
                </Grid>

                <Grid container  size={12}>
                <OutfitList outfitList={outfits} setCurrentlyWearing={setCurrentlyWearing}/>

                </Grid>
            </Grid>
        </Grid>
    )
}
export default Outfits
