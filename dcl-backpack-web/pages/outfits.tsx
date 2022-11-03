import type {NextPage} from 'next'
import styles from '../styles/Home.module.css'
import {useState} from "react";
import {Grid} from "@mui/material";
import {useWeb3Context} from "../src/context/Web3Context";
import PreviewFrame from "../src/components/wearables/PreviewFrame";
import {useWearableContext} from "../src/context/WearableContext";
import CurrentlyWearing from "../src/components/wearables/CurrentlyWearing";


const Outfits: NextPage = () => {

    const [data, setData] = useState(null)
    const [dataSorted, setDataSorted] = useState<Map<string, any> | null>(null)
    const [isLoading, setLoading] = useState(false)
    const [previewUrns, setPreviewUrns] = useState<string[]>([])
    const [backpackAddress, setBackpackAddress] = useState<string | undefined>()

    const {address: avatarAddress} = useWeb3Context()
    const {currentlyWearing, setCurrentlyWearing} = useWearableContext()

    return (
        <Grid container xs={12}>

            <Grid item xs={0} sm={.25}>

            </Grid>

            <Grid item xs={12} sm={3}>

                {avatarAddress && <PreviewFrame avatarAddress={avatarAddress} height={'800px'}/>}

                <div className={styles.grid}>
                    <CurrentlyWearing cardSize={2}/>
                </div>

            </Grid>

        </Grid>
    )
}

export default Outfits
