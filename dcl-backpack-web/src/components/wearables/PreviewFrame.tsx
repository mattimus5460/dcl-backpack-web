"use client";
import styles from "@/styles/Home.module.css";
import React, {useEffect, useState} from "react";
import {useWearableContext} from "@/context/WearableContext";
import {Color3} from "@dcl/schemas/dist/schemas";
import {colorToHex} from "@/utils/utils";

export interface PreviewFrameProps {
	height: string;
	overrideProfile?: string[];
}

const PreviewFrame: React.FC<PreviewFrameProps> = ({
	height,
	overrideProfile,
}) => {

	const {currentlyWearing, profile} = useWearableContext();
	const [hairColor, setHairColor] = useState("");
	const [skinColor, setSkinColor] = useState("");
	const [bodyShape, setBodyShape] = useState("");

	const explodeUrns = (urns: string[]) => {
		return urns.filter(urn => urn != "").join("&urn=");
	};

	useEffect(() => {
		let hairCol = colorToHex(profile.avatar?.avatar.hair.color);
		let skinCol = colorToHex(profile.avatar?.avatar.skin.color);

		setHairColor(hairCol || "");
		setSkinColor(skinCol || "");

		let bodyShape = profile.avatar?.avatar.bodyShape;
		setBodyShape(bodyShape || "");

	}, [profile]);

	return (
		<iframe id="previewIframe" className={styles.previewIframe}
				width={"100%"} height={height}
				src={`https://wearable-preview.decentraland.org/?disableBackground&urn=${explodeUrns(overrideProfile ?? currentlyWearing)}&skin=${skinColor}&hair=${hairColor}&bodyShape=${bodyShape}`}/>
	);
};

export default PreviewFrame;
