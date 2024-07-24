import React, {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";
import {
	fetchPlayerDataOutfits,
	fetchPlayerDataProfileAvatar2,
	getAllNftDataForUrns,
} from "../../pages/api/wearables/[...params]";
import {Item, WearableId} from "@dcl/schemas";
import {useWeb3Context} from "./Web3Context";
import {Avatar, Snapshots} from "@dcl/schemas/dist/schemas";

const wearableInitialState: WearableProviderState = {
	currentlyWearing: [],
	currentlyWearingData: [],
	currentlyWearingMap: new Map(),
	setCurrentlyWearing: () => {
	},
	updateCurrentlyWearing: () => {
	},
	removeCategoryItem: () => {
	},
	profile: {name: ""},
	lambdaOutfits: [],
};

interface WearableProviderState {
	currentlyWearing: string[];
	currentlyWearingData: Item[] | null | undefined;
	currentlyWearingMap: Map<string, CurrentlyWearingContextProps | undefined>;
	lambdaOutfits: OutfitMap[];
	setCurrentlyWearing: Function;
	updateCurrentlyWearing: Function;
	removeCategoryItem: Function;
	profile: AvatarProfile;
}

interface AvatarProfile {
	name: string;
	snapshots?: Snapshots;
	avatar?: Avatar;
}

const WearableContext = createContext<WearableProviderState>(wearableInitialState);

export interface CurrentlyWearingContextProps {
	category: string;
	name: string;
	thumbnail: string;
	rarity: string;
	urn: string;
}

export interface OutfitMap {
	[category: string]: CurrentlyWearingContextProps;
}

export const WearableContextProvider = ({children}: PropsWithChildren) => {
	const {address: avatarAddress} = useWeb3Context();

	const [currentlyWearingUrns, setCurrentlyWearingUrns] = useState<string[]>([]);
	const [currentlyWearingData, setCurrentlyWearingData] = useState<Item[]>([]);
	const [currentlyWearingMap, setCurrentlyWearingMap] = useState<Map<string, CurrentlyWearingContextProps | undefined>>(new Map());
	const [profile, setProfile] = useState<AvatarProfile>({name: ""});


	const [lambdaOutfits, setLambdaOutfits] = useState<OutfitMap[]>([]);

	const updateCurrentlyWearing = (category: string, urn: string, name: string, thumbnail: string, rarity: string) => {
		const updatedMap = new Map(currentlyWearingMap.set(category, {
			category,
			name,
			thumbnail,
			rarity,
			urn,
		}));
		setCurrentlyWearingMap(updatedMap);
	};

	const removeCategoryItem = (category: string) => {
		console.log("delete");
		currentlyWearingMap.delete(category);
		setCurrentlyWearingMap(new Map(currentlyWearingMap));

	};

	useEffect(() => {
		if (!avatarAddress) {
			setProfile({name: ""});
			setCurrentlyWearingUrns([]);
			setCurrentlyWearingData([]);
			return;
		}

		fetchPlayerDataProfileAvatar2(avatarAddress)
			.then((profile) => {

				if (!profile) return;

				setProfile(profile);

				const currentWearablesUrns: WearableId[] = profile.avatar.avatar.wearables;
				if (!currentWearablesUrns) {
					return;
				}

				setCurrentlyWearingUrns(currentWearablesUrns);

				getAllNftDataForUrns(currentWearablesUrns).then(
					(data) => {
						setCurrentlyWearingMap(data);
					},
				);

			});
	}, [avatarAddress]);

	useEffect(() => {
		if (!avatarAddress) {
			setLambdaOutfits([]);
			return;
		}

		fetchPlayerDataOutfits(avatarAddress)
			.then(async (outfits) => {

				if (!outfits) {
					return;
				}

				const outfitMaps = await Promise.all(outfits.map(async (outfit) => {

					const data = await getAllNftDataForUrns(outfit.outfit.wearables);
					console.log(outfit.slot);

					const allOutfitMaps: OutfitMap[] = [];
					let curMap: OutfitMap = {};

					data.forEach((item, category) => {
						if (item) {
							curMap[category] = item;
						}
					});

					allOutfitMaps.push(curMap);
					return allOutfitMaps;
				}));

				setLambdaOutfits(outfitMaps.flat());
			});
	}, [avatarAddress]);


	useEffect(() => {
		let curUrns: string[] = [];

		currentlyWearingMap.forEach((v) => {
			if (!v) return;
			curUrns.push(v.urn);
		});

		console.log(curUrns);
		setCurrentlyWearingUrns(curUrns);
	}, [currentlyWearingMap]);


	return (
		<WearableContext.Provider value={{
			currentlyWearing: currentlyWearingUrns,
			currentlyWearingData,
			currentlyWearingMap,
			lambdaOutfits,
			setCurrentlyWearing: setCurrentlyWearingMap,
			updateCurrentlyWearing,
			removeCategoryItem,
			profile,
		}}>
			{children}
		</WearableContext.Provider>
	);

};

export function useWearableContext() {
	return useContext(WearableContext);
}
