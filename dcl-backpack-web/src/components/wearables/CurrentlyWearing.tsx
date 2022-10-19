import styles from "../../../styles/Home.module.css";
import {useWearableContext} from "../../context/WearableContext";
import React from "react";

export interface CurrentlyWearingProps {
}

const CurrentlyWearing: React.FC<CurrentlyWearingProps> = () => {

    const {currentlyWearing, currentlyWearingData} = useWearableContext()

    const getImageComponents = () => {
        return currentlyWearingData && currentlyWearingData.map((data) => (
                data && <WearableCard name={data.name} thumbnail={data.thumbnail}/>
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
}

const WearableCard: React.FC<WearableCardProps> = ({name, thumbnail}) => {

    return (
        <div className={`${styles.card}`}>
            <img width={'100px'} height={'100px'} src={thumbnail}/>
            <br/>
            {name}
        </div>
    )
}


export default CurrentlyWearing