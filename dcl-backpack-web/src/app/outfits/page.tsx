"use client";
import type {NextPage} from "next";
import React, {useEffect, useState} from "react";
import {Grid2 as Grid} from "@mui/material";
import {useWeb3Context} from "@/context/Web3Context";
import PreviewFrame from "@/components/wearables/PreviewFrame";
import {OutfitMap, useWearableContext} from "@/context/WearableContext";
import CurrentlyWearing from "@/components/wearables/CurrentlyWearing";
import OutfitList from "@/components/wearables/OutfitList";

const Outfits: NextPage = () => {

	const [isLoading, setLoading] = useState(false);
	const [previewUrns, setPreviewUrns] = useState<string[]>([]);
	const [backpackAddress, setBackpackAddress] = useState<string | undefined>();

	const [outfits, setOutfits] = useState<OutfitMap[]>([]);

	const {address: avatarAddress} = useWeb3Context();
	const {
		currentlyWearing,
		setCurrentlyWearing,
		lambdaOutfits,
	} = useWearableContext();

	useEffect(() => {
		if (!avatarAddress) return;
		fetch(`https://us-central1-dcl-closet.cloudfunctions.net/api/outfits/${avatarAddress}`)
			.then(res => res.ok ? res.json() : Promise.reject("bad res"))
			.then(data => setOutfits(data.map((doc: {
				outfit: any
			}) => doc.outfit)))
			.catch(console.log);
	}, [avatarAddress]);

	return (
		<Grid alignItems={"top"} container size={12}>

			<Grid size={4}

			>
				<Grid container size={12} sx={{
					position: "sticky",
					top: 0,
				}}>
					{avatarAddress &&
                      <PreviewFrame
                                    height={"800px"}/>}
					<CurrentlyWearing cardSize={2} showUpdate={true}/>
				</Grid>

			</Grid>
			<Grid container size={7}>

				<Grid container size={12}>
					<h2>In-World Outfits</h2>
				</Grid>

				<Grid container size={12}>
					<OutfitList outfitList={lambdaOutfits}
								setCurrentlyWearing={setCurrentlyWearing}/>
				</Grid>
				<Grid container size={12}>
					<h2>Saved Outfits</h2>
				</Grid>

				<Grid container size={12}>
					<OutfitList outfitList={outfits}
								setCurrentlyWearing={setCurrentlyWearing}/>

				</Grid>
			</Grid>
		</Grid>
	);
};
export default Outfits;
