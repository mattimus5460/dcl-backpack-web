import styles from "../../../styles/Home.module.css";
import {CurrentlyWearingContextProps, useWearableContext} from "../../context/WearableContext";
import React, {ReactNode, useEffect, useState} from "react";
import wearablesStyles from "../../../styles/Wearables.module.css";
import {Grid} from "@mui/material";
import {getNameForCategory} from "../../utils/utils";

export interface CurrentlyWearingProps {
    cardSize: number
}

const CurrentlyWearing: React.FC<CurrentlyWearingProps> = ({cardSize}) => {

    const {currentlyWearingMap} = useWearableContext()
    const [currentlyWearingItems, setCurrentlyWearingItems] = useState<ReactNode[]>([])


    useEffect(() => {
        let cwiList: ReactNode[] = []
        currentlyWearingMap.forEach((value, category) => {
            if (!value || category === 'not-found')
                return
            cwiList.push(getCardForItem(category, value))
        })

        setCurrentlyWearingItems(cwiList)
    }, [currentlyWearingMap])

    const getCardForItem = (category: string, item: CurrentlyWearingContextProps) => {
        return (
            <WearableCard category={category}
                          name={item.name} thumbnail={item.thumbnail} rarity={item.rarity}
                          cardSize={cardSize}/>
        )
    }

    // const getImageComponents = () => {
    //     return currentlyWearingData && currentlyWearingData.map((data) => (
    //             data && <WearableCard name={data.name} thumbnail={data.thumbnail} rarity={data.rarity}/>
    //         )
    //     )
    // }

    return <>{currentlyWearingItems}</>
}

interface WearableCardProps {
    category: string
    name?: string
    thumbnail: string
    rarity: string
    cardSize: number
}

const WearableCard: React.FC<WearableCardProps> = ({category, name, thumbnail, rarity, cardSize}) => {

    return (
        <Grid xs={cardSize} textAlign={'center'}>
            {/*<Image alt={item.definition.name} loader={customLoader}*/}
            {/*    // width={showFullWearableInfo? '150': '100'}*/}
            {/*    // height={showFullWearableInfo? '150': '100'}*/}
            {/*       fill*/}
            {/*       src={item.definition.thumbnail}/><br/>*/}


            {getNameForCategory(category)}

            <div className={`${styles.card} ${wearablesStyles[rarity]}`}>
                <img alt={name} width={'100%'} height={'100%'} src={thumbnail}/>
            </div>
        </Grid>
    )
}


export default CurrentlyWearing