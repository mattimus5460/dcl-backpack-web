import styles from "../../../styles/Home.module.css";
import {useWearableContext} from "../../context/WearableContext";
import React from "react";
import wearablesStyles from "../../../styles/Wearables.module.css";

export interface CurrentlyWearingProps {
}

const CurrentlyWearing: React.FC<CurrentlyWearingProps> = () => {

    const {currentlyWearingData} = useWearableContext()

    const getImageComponents = () => {
        return currentlyWearingData && currentlyWearingData.map((data) => (
                data && <WearableCard name={data.name} thumbnail={data.thumbnail} rarity={data.rarity}/>
            )
        )
    }

    return <>
        {currentlyWearingData ?
            getImageComponents()
            :
            <></>}
    </>
}

interface WearableCardProps {
    name: string
    thumbnail: string
    rarity: string
}

const WearableCard: React.FC<WearableCardProps> = ({name, thumbnail, rarity}) => {

    return (
        <div className={`${styles.card} ${wearablesStyles[rarity]}`}>
            <img alt={name} width={'100px'} height={'100px'} src={thumbnail}/>
        </div>
    )
}


export default CurrentlyWearing