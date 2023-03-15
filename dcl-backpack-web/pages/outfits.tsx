import type {NextPage} from 'next'
import styles from '../styles/Home.module.css'
import React, {useEffect, useState} from "react";
import {Grid} from "@mui/material";
import {useWeb3Context} from "../src/context/Web3Context";
import PreviewFrame from "../src/components/wearables/PreviewFrame";
import {OutfitMap, useWearableContext} from "../src/context/WearableContext";
import CurrentlyWearing from "../src/components/wearables/CurrentlyWearing";
import OutfitList from "../src/components/wearables/OutfitList";

const Outfits: NextPage = () => {

    const [data, setData] = useState(null)
    const [dataSorted, setDataSorted] = useState<Map<string, any> | null>(null)
    const [isLoading, setLoading] = useState(false)
    const [previewUrns, setPreviewUrns] = useState<string[]>([])
    const [backpackAddress, setBackpackAddress] = useState<string | undefined>()

    const [outfits, setOutfits] = useState<OutfitMap[]>([])

    const {address: avatarAddress} = useWeb3Context()
    const {currentlyWearing, setCurrentlyWearing} = useWearableContext()

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
        <Grid alignItems={'center'} container xs={12}>

            <Grid item xs={.25}>
            </Grid>
            <Grid item xs={3}>
                {avatarAddress && <PreviewFrame avatarAddress={avatarAddress} height={'800px'}/>}

                <div className={styles.grid}>
                    <CurrentlyWearing cardSize={2} showUpdate={true}/>
                </div>
            </Grid>
            <Grid item xs={1}>
            </Grid>

            <Grid item container  xs={7}>
                <OutfitList outfitList={outfits} setCurrentlyWearing={setCurrentlyWearing}/>
            </Grid>
        </Grid>
    )
}
export default Outfits
