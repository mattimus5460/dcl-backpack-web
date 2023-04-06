import styles from "../../../styles/Home.module.css";
import React, {useEffect, useState} from "react";
import {useWearableContext} from "../../context/WearableContext";
import {Color3} from "@dcl/schemas/dist/schemas";

export interface PreviewFrameProps {
	avatarAddress: string;
	height: string;
}

const PreviewFrame: React.FC<PreviewFrameProps> = ({height}) => {

	const {currentlyWearing, profile} = useWearableContext();
	const [hairColor, setHairColor] = useState("");
	const [skinColor, setSkinColor] = useState("");
	const [bodyShape, setBodyShape] = useState("");

	const explodeUrns = (urns: string[]) => {
		return urns.join("&urn=");
	};

	function componentToHex(c: number) {
		let hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	function rgbToHex(r: number, g: number, b: number) {
		return "%23" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	}

	function colorToHex(color: Color3 | undefined) {
		if (!color) return;
		return rgbToHex(Math.floor(color.r * 255), Math.floor(color.g * 255), Math.floor(color.b * 255));
	}

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
				src={`https://wearable-preview.decentraland.org/?disableBackground&urn=${explodeUrns(currentlyWearing)}&skin=${skinColor}&hair=${hairColor}&bodyShape=${bodyShape}`}/>
	);
};

export default PreviewFrame;
