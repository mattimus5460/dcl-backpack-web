import {OutfitMap} from "../../context/WearableContext";
import React from "react";
import {getCardForItem} from "./WearableCard";
import {Button, Grid} from "@mui/material";
import styles from "../../../styles/Home.module.css";
import wearablesStyles from "../../../styles/Wearables.module.css";
import backpackStyles from "../../../styles/Backpack.module.css";

interface OutfitListProps {
    outfitList: OutfitMap[],
    setCurrentlyWearing: Function
}

const OutfitList: React.FC<OutfitListProps> = ({outfitList, setCurrentlyWearing}) => {

    const createOutfit = (outfit: OutfitMap) => {
        const allCards = []
        for (const [key, value] of Object.entries(outfit)) {
            if (key == "not-found")
                continue

            allCards.push(getCardForItem(key, value, .75))
        }
        return (<>
            <Grid container xs={12}>
                {/*<Grid xs={1} onClick={() => {*/}
                {/*    setCurrentlyWearing(new Map(Object.entries(outfit)))*/}
                {/*}}>*/}
                {/*    Set Outfit*/}
                {/*    <div className={`${styles.card} ${wearablesStyles["common"]}`}>*/}

                {/*    </div>*/}
                {/*</Grid>*/}
                {allCards}
            </Grid>
            <Grid container xs={2}>
                <a
                    onClick={() => {
                        setCurrentlyWearing(new Map(Object.entries(outfit)))
                    }}
                    className={`${backpackStyles.removeButton}`}>
                    Set Outfit
                    {/*<img alt={item.definition.name} width={'100%'} src={item.definition.thumbnail}/>*/}

                </a>
            </Grid>
            </>
        )
    }

    return <>
        {outfitList.map(createOutfit)}
    </>
}

export default OutfitList