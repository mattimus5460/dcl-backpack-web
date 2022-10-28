import type {NextPage} from 'next'
import homeStyles from '../styles/Home.module.css'
import wearablesStyles from '../styles/Wearables.module.css'
import backpackStyles from '../styles/Backpack.module.css'
import {useEffect, useState} from "react";
import {Item, PreviewMessageType, sendMessage} from '@dcl/schemas'
import {fetchAllPlayerWearables, getMktLinkFromUrn, LambdaWearable} from "./api/wearables/[...params]";
import {Checkbox, FormControlLabel, Grid, Popover, Typography} from "@mui/material";
import {useWeb3Context} from "../src/context/Web3Context";
import PreviewFrame from "../src/components/wearables/PreviewFrame";
import {useWearableContext} from "../src/context/WearableContext";


const Backpack: NextPage = () => {

    const [dataSorted, setDataSorted] = useState<Map<string, any> | null>(null)
    const [isLoading, setLoading] = useState(false)
    const [previewUrns, setPreviewUrns] = useState<string[]>([])
    const [backpackAddress, setBackpackAddress] = useState<string | undefined>()
    const [showFullWearableInfo, setShowFullWearableInfo] = useState(false)

    const {address: avatarAddress} = useWeb3Context()

    const {currentlyWearing, setCurrentlyWearing} = useWearableContext()


    useEffect(() => {
        setLoading(true)

        fetchAllPlayerWearables(`${backpackAddress ? backpackAddress : avatarAddress}`)
            .then((wearableResp) => {

                if (!wearableResp)
                    return

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
                <Grid sx={{borderBottom: '1px solid #242129', padding: '1em'}} container>
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

    const getSectionItem = (item: LambdaWearable) => {

        if (!item || !item.definition)
            return <></>

        return (
            <Grid xs={showFullWearableInfo ? 1.2 : .7}>
                <a
                    onClick={() => {
                        sendUpdate(item);
                    }}>
                    <div
                        className={`${homeStyles.card} ${isCardSelected(item.definition.id) ? homeStyles.selected : ''}  ${wearablesStyles[item.definition.rarity]}  `}>
                        <img alt={item.definition.name} width={'100%'} src={item.definition.thumbnail}/><br/>


                    </div>
                </a>
                <a onMouseOver={(e) => handlePopoverOpen(e, item)}>+</a>
                {showFullWearableInfo &&
                    <div
                        className={`${homeStyles.cardLabel} ${isCardSelected(item.definition.id) ? homeStyles.selected : ''}`}>
                        <p>
                            <a target={'_blank'} href={getMktLinkFromUrn(item.urn)}>{item.definition?.name}</a>
                        </p>
                        <p>{item.definition.description}</p>
                        {/*<p>{item.definition.rarity}</p>*/}
                    </div>}
            </Grid>
        )
    }

    const sendUpdate = (item: LambdaWearable) => {
        const iframe = document.getElementById("previewIframe") as HTMLIFrameElement;


        setPreviewUrns([item.urn, ...previewUrns])
        setCurrentlyWearing([item.urn, ...currentlyWearing])

        if (iframe && iframe.contentWindow) {
            sendMessage(iframe.contentWindow, PreviewMessageType.UPDATE, {
                options: {
                    urns: [...previewUrns, item.urn]
                }
                ,
            })
        }
    }

    function toggleShowFullWearableInfo() {
        setShowFullWearableInfo(!showFullWearableInfo)
    }


    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [popoverContent, setPopoverContent] = useState<JSX.Element | null>()

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, item: any) => {
        setAnchorEl(event.currentTarget.parentElement);
        setPopoverContent(createPopoverContent(item))
    };

    const createPopoverContent = (item: LambdaWearable) => {
        return (<>
            <a target={'_blank'} href={getMktLinkFromUrn(item.urn)}>{item.definition?.name}</a><br/>
            {item.definition?.description} <br/>
            {/*{item.definition?.rarity} <br/>*/}
        </>)
    }

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <Grid container xs={12}>
            <Grid item xs={12} sm={2}>
                <Grid xs={12}>
                    <div className={backpackStyles.description}>
                        <form onSubmit={(e) => {
                            e.preventDefault()
                        }}>
                            <label className={backpackStyles.addressLabel}>
                                Backpack Address
                            </label>
                            <input type="text" id={'addressInput'} className={backpackStyles.addressInput}
                                   value={backpackAddress}
                                   onChange={(event => {
                                       setBackpackAddress(event.target.value)
                                   })}/>
                        </form>
                    </div>
                </Grid>

                <Grid xs={12}>
                    <div className={backpackStyles.description}>
                        <FormControlLabel
                            control={<Checkbox id={'showFullWearableInfoCheckbox'} color={'secondary'}
                                               checked={showFullWearableInfo} onChange={toggleShowFullWearableInfo}/>}
                            label="Show all wearable info"
                        />
                    </div>
                </Grid>

                <Grid className={backpackStyles.sticky} xs={12}>
                    {avatarAddress && <PreviewFrame avatarAddress={avatarAddress} height={'500px'}/>}
                </Grid>
            </Grid>

            <Grid container item xs={12} sm={10}>
                {isLoading && <div>Loading</div>}
                {!isLoading && dataSorted && getSections(dataSorted).map(section => {
                    return section
                })}

                <Popover
                    id="mouse-over-popover"
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    onClose={handlePopoverClose}
                >
                    <Typography
                        className={`${backpackStyles.popover}`} sx={{p: 1}}>{popoverContent}</Typography>
                </Popover>
            </Grid>
        </Grid>
    )
}

export default Backpack