"use client";
import {OutfitMap} from "@/context/WearableContext";
import React from "react";
import {getCardForItem} from "./WearableCard";
import {Grid2 as Grid} from "@mui/material";
import backpackStyles from "@/styles/Backpack.module.css";
import RepeatIcon from "@mui/icons-material/Repeat";
import PreviewFrame from "@/components/wearables/PreviewFrame";

interface OutfitListProps {
	outfitList: OutfitMap[],
	setCurrentlyWearing: Function
}

const OutfitList: React.FC<OutfitListProps> = ({
	outfitList,
	setCurrentlyWearing,
}) => {

	const createOutfit = (outfit: OutfitMap) => {
		const allCards = [];
		for (const [key, value] of Object.entries(outfit)) {
			if (key == "not-found") {
				continue;
			}

			allCards.push(getCardForItem(key, value, {xs: 3}));
		}
		const outfitUrns = Object.values(outfit).map(v => v.urn);

		console.log("OutfitList", outfit, outfitUrns);
		return (<>
				<Grid container className={`${backpackStyles.outfitRow}`}
					  size={{xs: 12, sm: 6}}>

					<Grid container size={{xs: 1}}>
						<a
							onClick={() => {
								setCurrentlyWearing(new Map(Object.entries(outfit)));
							}}
							className={`${backpackStyles.setOutfitButton}`}>
							Change Outfit<br/>
							<RepeatIcon/>
						</a>
					</Grid>

					{/* <Grid container size={{xs: 3}}> */}
					{/* 	<PreviewFrame height={"100%"}  overrideProfile={outfitUrns}/> */}
					{/* </Grid> */}

					<Grid container alignItems={"top"} alignContent={"start"}
						  size={{xs: 8}}>
						{allCards}
					</Grid>
				</Grid>

			</>
		);
	};

	return <>
		{outfitList.length > 0 ? outfitList.map(createOutfit) :
			<div>Loading...</div>}
	</>;
};

export default OutfitList;
