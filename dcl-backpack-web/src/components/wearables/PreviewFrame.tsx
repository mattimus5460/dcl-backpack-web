import styles from "../../../styles/Home.module.css";
import React from "react";
import {useWearableContext} from "../../context/WearableContext";

export interface PreviewFrameProps {
    avatarAddress: string
    height: string
}

const PreviewFrame: React.FC<PreviewFrameProps> = ({avatarAddress, height}) => {

    const {currentlyWearing} = useWearableContext()

    const explodeUrns = (urns: string[]) => {
        return urns.join('&urn=')
    }

    return (
        <iframe id="previewIframe" className={styles.previewIframe} width={'100%'} height={height}
                src={`https://wearable-preview.decentraland.org/?profile=${avatarAddress}&disableBackground&urn=${explodeUrns(currentlyWearing)} `}/>
    )
}

export default PreviewFrame