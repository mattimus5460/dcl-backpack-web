'use client'
import type {NextPage} from "next";
import {Grid2 as Grid} from "@mui/material";
import {useWeb3Context} from "@/context/Web3Context";
import PreviewFrame from "@/components/wearables/PreviewFrame";
import CurrentlyWearing from "@/components/wearables/CurrentlyWearing";
import React from "react";

const Home: NextPage = () => {

	const {address: avatarAddress} = useWeb3Context();

	return (
		<Grid container justifyContent={"center"} size={12}>
			<Grid size={2}>
				{avatarAddress && <PreviewFrame avatarAddress={avatarAddress}
                                                height={"800px"}/>}
			</Grid>

			<Grid container size={4} rowSpacing={0}  alignContent={"center"}>
				<CurrentlyWearing cardSize={2}/>
			</Grid>
		</Grid>
	);
};

export default Home;