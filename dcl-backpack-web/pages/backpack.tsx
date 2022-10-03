import type {NextPage} from 'next'
import styles from '../styles/Home.module.css'
import {useEffect, useState} from "react";
import {PreviewMessageType, sendMessage} from '@dcl/schemas'
import {fetchAllPlayerWearables, fetchPlayerDataProfileWearables, getWearableInfo} from "./api/wearables/[...params]";
import {Grid} from "@mui/material";
import { Web3Button } from '../src/components/Web3Button';
import {useWeb3Context} from "../src/context/Web3Context";


const Backpack: NextPage = () => {

    const [data, setData] = useState(null)
    const [dataSorted, setDataSorted] = useState<Map<string, any> | null>(null)
    const [isLoading, setLoading] = useState(false)
    const [previewUrns, setPreviewUrns] = useState<string[]>([])
    const [currentlyWearing, setCurrentlyWearing] = useState<string[]>([])
    const [currentlyWearingImages, setCurrentlyWearingImages] = useState<string[] | undefined[] | undefined>([])
    const [backpackAddress, setBackpackAddress] = useState<string | undefined>()
    // const [avatarAddress, setAvatarAddress] = useState<string | undefined>()

    const {address: avatarAddress} = useWeb3Context()

    useEffect(() => {

        if(!currentlyWearing)
            return

        const getThumbnail = async (urn: string) => {
            const info = await getWearableInfo(urn)
            return info?.thumbnail
        }

        const allWearables: Promise<string | undefined>[] = currentlyWearing.map((urn) => {
            return getThumbnail(urn)
        })

        // @ts-ignore
        Promise.all(allWearables).then(setCurrentlyWearingImages)

    }, [currentlyWearing])


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

    useEffect(() => {
        if (!avatarAddress)
            return

        fetchPlayerDataProfileWearables(avatarAddress)
            .then((wearableResp) => {
                setCurrentlyWearing(wearableResp)
            })
    }, [avatarAddress])

    const getNameForCategory = (categoryName: string) => {
        return categoryName.split("_").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")
    }

    const getSections = (wearableData: Map<string, any>) => {
        const allCategories: JSX.Element[] = []
        wearableData.forEach((items, category) => {
            allCategories.push((
                <div>
                    <h1>{getNameForCategory(category)}</h1>
                    <div className={styles.grid}>
                        {items.map(getSectionItem)}
                    </div>
                </div>
            ))
        });
        return allCategories;
    }

    const getCurrentlyWearingSection = (wearableImages: string[]) => {
        return wearableImages.map((image) => (
                image && <div className={`${styles.card}`}>
                    <img width={'100px'} height={'100px'} src={image}/>
                </div>
            )
        )
    }

    const isCardSelected = (urn: string) => {
        return currentlyWearing && currentlyWearing.includes(urn);
    }

    const getSectionItem = (item: any) => {
        return (
            <div className={`${styles.card} ${isCardSelected(item.definition.id) ? styles.selected : ''}`}>
                <a onClick={() => sendUpdate(item.definition.id)} href="#">
                    <img width={'120px'} height={'120px'} src={item.definition.thumbnail}/>
                    {/*<h4>{item.definition.name}</h4>*/}
                    {/*<p>{item.definition.description}</p>*/}
                </a>
            </div>
        )
    }

    const sendUpdate = (urn: string) => {
        const iframe = document.getElementById("previewIframe") as HTMLIFrameElement;

        setPreviewUrns([urn, ...previewUrns])
        setCurrentlyWearing([urn, ...currentlyWearing])

        if (iframe && iframe.contentWindow) {
            sendMessage(iframe.contentWindow, PreviewMessageType.UPDATE, {
                options: {
                    urns: [...previewUrns, urn],
                    zoom:100,
                    wheelZoom: 5
                }
                ,
            })
        }
    }

    // @ts-ignore
    return (
        <Grid container xs={12}>

            <Grid item xs={12} sm={2}>

                <Grid xs={12}>

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
                    <iframe id="previewIframe" className={styles.previewIframe} width={'100%'} height={'500px'}
                            src={`https://wearable-preview.decentraland.org/?profile=${avatarAddress}`}/>

                    <div>
                        <h2>Wearing</h2>
                        <div className={styles.grid}>
                            {// @ts-ignore
                                getCurrentlyWearingSection(currentlyWearingImages)}
                        </div>
                    </div>

                </Grid>


            </Grid>
            <Grid item xs={12} sm={10}>
                <div className={styles.grid}>
                    {isLoading && <div>Loading</div>}
                    {!isLoading && dataSorted && getSections(dataSorted).map(section => {
                        return section
                    })}
                </div>
            </Grid>


        </Grid>
    )
}

export default Backpack