import type {NextPage} from 'next'
import homeStyles from '../styles/Home.module.css'
import wearablesStyles from '../styles/Wearables.module.css'
import backpackStyles from '../styles/Backpack.module.css'
import {useEffect, useState} from "react";
import {fetchAllPlayerWearables, getMktLinkFromUrn, LambdaWearable} from "./api/wearables/[...params]";
import {Box, Checkbox, FormControlLabel, Grid, Stack} from "@mui/material";
import {useWeb3Context} from "../src/context/Web3Context";
import PreviewFrame from "../src/components/wearables/PreviewFrame";
import {useWearableContext} from "../src/context/WearableContext";
import CurrentlyWearing from "../src/components/wearables/CurrentlyWearing";
import {getNameForCategory} from "../src/utils/utils";


const Backpack: NextPage = () => {

    const [dataSorted, setDataSorted] = useState<Map<string, any> | null>(null)
    const [isLoading, setLoading] = useState(false)
    const [backpackAddress, setBackpackAddress] = useState<string | undefined>()
    const [showFullWearableInfo, setShowFullWearableInfo] = useState(false)
    const [wearablesCount, setWearablesCount] = useState<number | null>()
    const [filterText, setFilterText] = useState<string | undefined>()

    const {address: avatarAddress} = useWeb3Context()

    const {currentlyWearing, currentlyWearingMap, updateCurrentlyWearing, removeCategoryItem} = useWearableContext()


    useEffect(() => {
        setLoading(true)

        fetchAllPlayerWearables(`${backpackAddress ? backpackAddress : avatarAddress}`)
            .then((wearableResp) => {

                if (!wearableResp)
                    return

                let totalWearables = 0;
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

                    totalWearables++
                })

                setWearablesCount(totalWearables)
                setDataSorted(wearablesByCategory)
                setLoading(false)
            })
    }, [backpackAddress, avatarAddress])


    const getSections = (wearableData: Map<string, any>) => {
        const allCategories: JSX.Element[] = []
        wearableData.forEach((items, category) => {
            allCategories.push((
                <Grid sx={{borderBottom: '1px solid #242129', padding: '1em'}} container>
                    <Grid xs={.8}>
                        <h3>{getNameForCategory(category).toUpperCase()}</h3>
                        <p className={backpackStyles.categoryCounts}>{items.length}</p>

                        {getRemoveSectionItem(category)}
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

    const getRemoveSectionItem = (category: string) => {
        const unremovableCategories = ["upper_body", "lower_body", "feet", "hair", "facial_hair", "eyes"]
        if (unremovableCategories.includes(category) || !currentlyWearingMap.has(category))
            return <></>

        return (
            <Grid item xs={showFullWearableInfo ? 1.2 : .7}>
                <a
                    onClick={() => {
                        removeSectionItem(category);
                    }}
                    className={`${backpackStyles.removeButton}`}>
                        Remove
                        {/*<img alt={item.definition.name} width={'100%'} src={item.definition.thumbnail}/>*/}

                </a>
            </Grid>
        )
    }

    const removeSectionItem = (category: string) => {
        removeCategoryItem(category)
    }

    const getSectionItem = (item: LambdaWearable) => {

        if (!item || !item.definition)
            return <></>

        if (filterText
            && (!item.definition.name.toLowerCase().includes(filterText.toLowerCase())
                && !item.definition.description.toLowerCase().includes(filterText.toLowerCase())))
            return

        return (
            <Grid item xs={showFullWearableInfo ? 1.2 : .7}>
                <a
                    onClick={() => {
                        sendUpdate(item);
                    }}>
                    <div
                        className={`${homeStyles.card} ${isCardSelected(item.definition.id) ? homeStyles.selected : ''}  ${wearablesStyles[item.definition.rarity]}  `}>
                        {/*<Image alt={item.definition.name} loader={customLoader}*/}
                        {/*    // width={showFullWearableInfo? '150': '100'}*/}
                        {/*    // height={showFullWearableInfo? '150': '100'}*/}
                        {/*       fill*/}
                        {/*       src={item.definition.thumbnail}/>*/}

                        <img alt={item.definition.name} width={'100%'} src={item.definition.thumbnail}/>

                    </div>
                </a>
                {/*<a onMouseOver={(e) => handlePopoverOpen(e, item)}>+</a>*/}
                {showFullWearableInfo &&
                    <div
                        className={`${homeStyles.cardLabel} ${isCardSelected(item.definition.id) ? homeStyles.selected : ''}`}>
                        <p>
                            <a target={'_blank'} rel="noreferrer noopener"
                               href={getMktLinkFromUrn(item.urn)}>{item.definition?.name}</a>
                        </p>
                        <p>{item.definition.description}</p>
                        {/*<p>{item.definition.rarity}</p>*/}
                    </div>}
            </Grid>
        )
    }

    const sendUpdate = (item: LambdaWearable) => {
        //const iframe = document.getElementById("previewIframe") as HTMLIFrameElement;
        //setCurrentlyWearing([...currentlyWearing, item.urn])

        updateCurrentlyWearing(item.definition?.data.category, item.urn, item.definition?.name, item.definition?.thumbnail, item.definition?.rarity)

        // if (iframe && iframe.contentWindow) {
        //     sendMessage(iframe.contentWindow, PreviewMessageType.UPDATE, {
        //         options: {
        //             urns: [...currentlyWearing, item.urn]
        //         }
        //         ,
        //     })
        // }
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
            <a target={'_blank'} rel="noreferrer noopener"
               href={getMktLinkFromUrn(item.urn)}>{item.definition?.name}</a><br/>
            {item.definition?.description} <br/>
            {/*{item.definition?.rarity} <br/>*/}
        </>)
    }

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    //const open = Boolean(anchorEl);

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
                    <div className={backpackStyles.description}>
                        <form onSubmit={(e) => {
                            e.preventDefault()
                        }}>
                            <label className={backpackStyles.addressLabel}>
                                Search by Name
                            </label>
                            <input type="text" id={'filterInput'} className={backpackStyles.addressInput}
                                   value={filterText}
                                   onChange={(event => {
                                       setFilterText(event.target.value)
                                   })}/>
                        </form>
                    </div>
                </Grid>

                <Grid xs={12}>
                    <div className={backpackStyles.description}>

                        Total Wearables: {wearablesCount}

                        <FormControlLabel
                            control={<Checkbox id={'showFullWearableInfoCheckbox'} color={'secondary'}
                                               checked={showFullWearableInfo} onChange={toggleShowFullWearableInfo}/>}
                            label="Show all wearable info"
                        />
                    </div>
                </Grid>

                <Grid className={backpackStyles.sticky} xs={12}>
                    <Stack>
                        <Box>
                            {avatarAddress && <PreviewFrame avatarAddress={avatarAddress} height={'500px'}/>}
                        </Box>
                        <Grid container xs={12}>
                            <CurrentlyWearing cardSize={3}/>
                        </Grid>
                    </Stack>
                </Grid>
            </Grid>

            <Grid container item xs={12} sm={10}>
                {isLoading && <div>Loading</div>}
                {!isLoading && dataSorted && getSections(dataSorted).map(section => {
                    return section
                })}

                {/*<Popover*/}
                {/*    id="mouse-over-popover"*/}
                {/*    open={open}*/}
                {/*    anchorEl={anchorEl}*/}
                {/*    anchorOrigin={{*/}
                {/*        vertical: 'bottom',*/}
                {/*        horizontal: 'left',*/}
                {/*    }}*/}
                {/*    transformOrigin={{*/}
                {/*        vertical: 'top',*/}
                {/*        horizontal: 'left',*/}
                {/*    }}*/}
                {/*    onClose={handlePopoverClose}*/}
                {/*>*/}
                {/*    <Typography*/}
                {/*        className={`${backpackStyles.popover}`} sx={{p: 1}}>{popoverContent}</Typography>*/}
                {/*</Popover>*/}
            </Grid>
        </Grid>
    )
}

export default Backpack