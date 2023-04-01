import {OutfitMap} from "../../context/WearableContext";
import React from "react";
import {getCardForItem} from "./WearableCard";
import {Grid} from "@mui/material";
import backpackStyles from "../../../styles/Backpack.module.css";
import RepeatIcon from "@mui/icons-material/Repeat";

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
            <Grid container className={`${backpackStyles.outfitRow}`} xs={12}>
                {/*<Grid xs={1} onClick={() => {*/}
                {/*    setCurrentlyWearing(new Map(Object.entries(outfit)))*/}
                {/*}}>*/}
                {/*    Set Outfit*/}
                {/*    <div className={`${styles.card} ${wearablesStyles["common"]}`}>*/}

                {/*    </div>*/}
                {/*</Grid>*/}


                <Grid container xs={.75}>
                    <a
                        onClick={() => {
                            setCurrentlyWearing(new Map(Object.entries(outfit)))
                        }}
                        className={`${backpackStyles.setOutfitButton}`}>
                        Change Outfit<br />
                        <RepeatIcon />
                        {/*<img alt={item.definition.name} width={'100%'} src={item.definition.thumbnail}/>*/}

                    </a>
                </Grid>


                {allCards}
            </Grid>

            </>
        )
    }

    return <>
        {outfitList.length > 0 ? outfitList.map(createOutfit) : <div>Loading...</div>}
    </>
}

export default OutfitList
