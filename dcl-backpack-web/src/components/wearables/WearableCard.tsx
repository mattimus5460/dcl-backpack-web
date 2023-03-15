import React from "react";
import {Grid} from "@mui/material";
import {getNameForCategory} from "../../utils/utils";
import styles from "../../../styles/Home.module.css";
import wearablesStyles from "../../../styles/Wearables.module.css";
import {CurrentlyWearingContextProps} from "../../context/WearableContext";

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


            <div hidden={true} className={`${wearablesStyles.cardCategory}}`}>
             {getNameForCategory(category).toUpperCase()}
            </div>

            <div className={`${styles.card} ${wearablesStyles[rarity]}`}>
                <img alt={name} width={'100%'} height={'100%'} src={thumbnail}/>
            </div>
        </Grid>
    )
}
export default WearableCard

export const getCardForItem = (category: string, item: CurrentlyWearingContextProps, cardSize: number) => {
    return (
        <WearableCard category={category}
                      name={item.name} thumbnail={item.thumbnail} rarity={item.rarity}
                      cardSize={cardSize}/>
    )
}