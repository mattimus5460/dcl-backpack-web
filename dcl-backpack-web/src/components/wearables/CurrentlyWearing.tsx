import styles from "../../../styles/Home.module.css";
import {CurrentlyWearingContextProps, useWearableContext} from "../../context/WearableContext";
import React, {ReactNode, useEffect, useState} from "react";
import wearablesStyles from "../../../styles/Wearables.module.css";
import {Button, Grid} from "@mui/material";
import {getNameForCategory} from "../../utils/utils";
import WearableCard, {getCardForItem} from "./WearableCard";
import {useWeb3Context} from "../../context/Web3Context";

export interface CurrentlyWearingProps {
    cardSize: number
}

const CurrentlyWearing: React.FC<CurrentlyWearingProps> = ({cardSize}) => {

    const {currentlyWearingMap} = useWearableContext()
    const {address: avatarAddress} = useWeb3Context()
    const [currentlyWearingItems, setCurrentlyWearingItems] = useState<ReactNode[]>([])

    useEffect(() => {
        let cwiList: ReactNode[] = []
        currentlyWearingMap.forEach((value, category) => {
            if (!value || category === 'not-found')
                return
            cwiList.push(getCardForItem(category, value, cardSize))
        })
        setCurrentlyWearingItems(cwiList)
    }, [currentlyWearingMap])

    async function saveCurrentlyWearing() {
        console.log(JSON.stringify(Object.fromEntries(currentlyWearingMap)))
        const response = await fetch("http://127.0.0.1:5001/dcl-closet/us-central1/api/addOutfit", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                outfit: Object.fromEntries(currentlyWearingMap),
                userId: avatarAddress
            })
        });

        console.log(response)
        return response.json();
    }

    return <>
        {currentlyWearingItems}

        <Grid xs={cardSize} textAlign={'center'}>
            <Button onClick={saveCurrentlyWearing} className={`${styles.card} ${wearablesStyles["common"]}`}>
                Save Outfit
            </Button>
        </Grid>
    </>
}

export default CurrentlyWearing