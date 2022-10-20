import type {NextPage} from 'next'
import styles from '../styles/Home.module.css'
import {useEffect, useState} from "react";
import {PreviewMessageType, sendMessage} from '@dcl/schemas'
import {fetchAllPlayerWearables} from "./api/wearables/[...params]";
import {Grid} from "@mui/material";
import {useWeb3Context} from "../src/context/Web3Context";
import PreviewFrame from "../src/components/wearables/PreviewFrame";
import {useWearableContext} from "../src/context/WearableContext";
import CurrentlyWearing from "../src/components/wearables/CurrentlyWearing";


const Backpack: NextPage = () => {

    const [data, setData] = useState(null)
    const [dataSorted, setDataSorted] = useState<Map<string, any> | null>(null)
    const [isLoading, setLoading] = useState(false)
    const [previewUrns, setPreviewUrns] = useState<string[]>([])
    const [backpackAddress, setBackpackAddress] = useState<string | undefined>()

    const {address: avatarAddress} = useWeb3Context()

    const {currentlyWearing, setCurrentlyWearing} = useWearableContext()


    useEffect(() => {
        setLoading(true)

        fetchAllPlayerWearables(`${backpackAddress ? backpackAddress : avatarAddress}`)
            .then((wearableResp) => {

                if (!wearableResp)
                    return

                setData(wearableResp)

                const wearablesByCategory = new Map()
                wearableResp.forEach((wearable: any) => {
                    if (!wearable.definition) {
                        console.log("No def found: " + JSON.stringify(wearable))
                        return
                    }

                    let curCategory = wearable.definition?.data?.category;
                    if (!curCategory)
                        curCategory = 'none'

                    let curForCategory = wearablesByCategory.get(curCategory)
                    if (!curForCategory)
                        wearablesByCategory.set(curCategory, [wearable])
                    else
                        wearablesByCategory.set(curCategory, [wearable, ...curForCategory])
                })

                setDataSorted(wearablesByCategory)
                setLoading(false)
            })
    }, [backpackAddress, avatarAddress])


    const getNameForCategory = (categoryName: string) => {
        return categoryName.split("_").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")
    }

    const getSections = (wearableData: Map<string, any>) => {
        const allCategories: JSX.Element[] = []
        wearableData.forEach((items, category) => {
            allCategories.push((
                <Grid sx={{borderBottom:'1px solid #242129'}} container>
                    <Grid xs={1}>
                        <h3>{getNameForCategory(category)}</h3>
                    </Grid>
                    <Grid xs={11} container>
                        {items.map(getSectionItem)}
                    </Grid>
                </Grid>
            ))
        });
        return allCategories;
    }

    const isCardSelected = (urn: string) => {
        return currentlyWearing && currentlyWearing.includes(urn);
    }

    const getSectionItem = (item: any) => {
        return (
            <Grid xs={12} className={`${styles.card} ${isCardSelected(item.definition.id) ? styles.selected : ''}`}>
                <a onClick={() => sendUpdate(item.definition.id)} href="#">
                    <img src={item.definition.thumbnail}/>
                    {/*{item.definition.name}*/}
                    {/*<p>{item.definition.description}</p>*/}
                </a>
            </Grid>
        )
    }

    const sendUpdate = (urn: string) => {
        const iframe = document.getElementById("previewIframe") as HTMLIFrameElement;

        setPreviewUrns([urn, ...previewUrns])
        setCurrentlyWearing([urn, ...currentlyWearing])

        if (iframe && iframe.contentWindow) {
            sendMessage(iframe.contentWindow, PreviewMessageType.UPDATE, {
                options: {
                    urns: [...previewUrns, urn]
                }
                ,
            })
        }
    }

    return (
        <Grid container xs={12}>
            <Grid item xs={12} sm={2}>
                <Grid xs={10}>
                    <div className={styles.description}>
                        <form onSubmit={(e) => {
                            e.preventDefault()
                        }}>
                            <label className={styles.addressLabel}>
                                Backpack Address
                            </label>
                            <input type="text" id={'addressInput'} className={styles.addressInput}
                                   value={backpackAddress}
                                   onChange={(event => {
                                       setBackpackAddress(event.target.value)
                                   })}/>
                        </form>
                    </div>
                </Grid>

                <Grid className={styles.sticky} xs={12}>
                    {avatarAddress && <PreviewFrame avatarAddress={avatarAddress} height={'400px'}/>}

                    <div className={styles.grid}>
                        <CurrentlyWearing/>
                    </div>
                </Grid>
            </Grid>

            <Grid container xs={12} sm={10}>
                {isLoading && <div>Loading</div>}
                {!isLoading && dataSorted && getSections(dataSorted).map(section => {
                    return section
                })}
            </Grid>
        </Grid>
    )
}

export default Backpack