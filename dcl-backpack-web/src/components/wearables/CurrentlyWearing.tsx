import styles from "../../../styles/Home.module.css";
import {
	CurrentlyWearingContextProps,
	useWearableContext,
} from "../../context/WearableContext";
import React, {ReactNode, useEffect, useState} from "react";
import wearablesStyles from "../../../styles/Wearables.module.css";
import {Button, Grid} from "@mui/material";
import {getNameForCategory} from "../../utils/utils";
import WearableCard, {getCardForItem} from "./WearableCard";
import {useWeb3Context} from "../../context/Web3Context";
import {Save, CloudUpload} from "@mui/icons-material";
import {Entity, EntityType} from "@dcl/schemas/dist/platform/entity";
import {Profile} from "@dcl/schemas";
import {EntitiesOperator, getHashesByKeyMap} from "../../utils/entities";

export interface CurrentlyWearingProps {
	cardSize: number;
	showSave?: boolean;
	showUpdate?: boolean;
}
export type ProfileEntity = Omit<Entity, 'metadata'> & {
	metadata: Profile
}


const CurrentlyWearing: React.FC<CurrentlyWearingProps> = ({
	cardSize,
	showSave = false,
	showUpdate = false
}) => {

	const {currentlyWearingMap, profile, currentlyWearing} = useWearableContext();
	const {address: avatarAddress, web3Provider} = useWeb3Context();
	const [currentlyWearingItems, setCurrentlyWearingItems] = useState<ReactNode[]>([]);

	useEffect(() => {
		let cwiList: ReactNode[] = [];
		currentlyWearingMap.forEach((value, category) => {
			if (!value || category === "not-found") {
				return;
			}
			cwiList.push(getCardForItem(category, value, cardSize));
		});
		setCurrentlyWearingItems(cwiList);
	}, [currentlyWearingMap, cardSize]);

	async function saveCurrentlyWearing() {
		console.log(JSON.stringify(Object.fromEntries(currentlyWearingMap)));
		const response = await fetch("https://us-central1-dcl-closet.cloudfunctions.net/api/addOutfit", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// 'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: JSON.stringify({
				outfit: Object.fromEntries(currentlyWearingMap),
				userId: avatarAddress,
			}),
		});

		console.log(response);
		return response.json();
	}

	async function updateCurrentlyWearing() {

		//console.log("ppp "+JSON.stringify(profile))

		if(!web3Provider || !avatarAddress || !profile.snapshots || !profile.avatar)
			return

		const URL = 'https://peer-testing.decentraland.org' //'https://peer-eu1.decentraland.org' //'https://peer-testing.decentraland.org' //'http://localhost:8000/api'
		const entitiesOperator = new EntitiesOperator(URL, web3Provider)

		const hbkm = getHashesByKeyMap(profile.snapshots)

		const removeUrlFromSnapshot = (snap:string) =>{
			const split = snap.split("/")
			return split[split.length -1]
		}
		console.log("hbkm1 "+JSON.stringify(hbkm.keys()))

		const metadata = {
			avatars:[
				{
					name: profile.avatar.name,
					description: profile.avatar.description,
					tutorialStep: profile.avatar.tutorialStep,
					ethAddress: profile.avatar.ethAddress,
					version: profile.avatar.version,
					avatar:

						{
							bodyShape: profile.avatar.avatar.bodyShape,
							eyes: profile.avatar.avatar.eyes,
							hair: profile.avatar.avatar.hair,
							skin: profile.avatar.avatar.skin,
							wearables: currentlyWearing.filter(w => w!=""),
							snapshots: {
								body: removeUrlFromSnapshot(profile.snapshots.body),
								face256: removeUrlFromSnapshot(profile.snapshots.face256)
							}
						}
				}]
		}

		await entitiesOperator.deployEntityWithoutNewFiles(
			metadata,
			hbkm,
			EntityType.PROFILE,
			avatarAddress,
			avatarAddress
		)

	}

	return <>
		{showSave &&
          <Grid xs={12} textAlign={"center"}>
            <Button onClick={saveCurrentlyWearing}
                    className={`${styles.card} ${wearablesStyles["common"]}`}>
              <Save/>
            </Button>
          </Grid>
		}

		{showUpdate &&
          <Grid xs={12} textAlign={"center"}>
            <Button onClick={updateCurrentlyWearing}
                    className={`${styles.card} ${wearablesStyles["epic"]}`}>
              <CloudUpload/>
            </Button>
          </Grid>
		}

		{currentlyWearingItems}
	</>;
};

export default CurrentlyWearing;
