import styles from "../../../styles/Home.module.css";
import React from "react";

export interface PreviewFrameProps {
    avatarAddress: string
    height: string
}

const PreviewFrame:React.FC<PreviewFrameProps> = ({avatarAddress, height}) => {

    return (
        <iframe id="previewIframe" className={styles.previewIframe} width={'100%'} height={height}
                src={`https://wearable-preview.decentraland.org/?profile=${avatarAddress}&background=18141a`}/>
    )
}

export default PreviewFrame