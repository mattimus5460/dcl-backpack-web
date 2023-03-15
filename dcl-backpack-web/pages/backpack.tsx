import type {NextPage} from "next";
import homeStyles from "../styles/Home.module.css";
import wearablesStyles from "../styles/Wearables.module.css";
import backpackStyles from "../styles/Backpack.module.css";
import {useEffect, useState} from "react";
import {
	fetchAllPlayerWearables,
	getMktLinkFromUrn,
	LambdaWearable,
} from "./api/wearables/[...params]";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Checkbox,
	Chip,
	FormControlLabel,
	Grid,
	InputAdornment,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import {useWeb3Context} from "../src/context/Web3Context";
import PreviewFrame from "../src/components/wearables/PreviewFrame";
import {useWearableContext} from "../src/context/WearableContext";
import CurrentlyWearing from "../src/components/wearables/CurrentlyWearing";
import {getNameForCategory} from "../src/utils/utils";
import {useRouter} from "next/router";
import {styled} from "@mui/system";
import {Clear, ExpandMore, Search} from "@mui/icons-material";


const CssTextField = styled(TextField)({
	backgroundColor: "#37333d",
	borderRadius: ".6em",
	margin: ".25em",
	width: "100%",
	"& label": {
		color: "#ddd",
		"&.Mui-focused": {
			color: "#ccc",
		},
	},
	"&.Mui-focused": {
		backgroundColor: "#aaa",
	},
});

const ChipRarity = styled(Chip)({
	backgroundColor: "#37333d",
	margin: ".25em",
	color: "#aaa",
	border: "1px solid 242129"
});

const AccordionStyled = styled(Accordion)({
	backgroundColor: "#242129",
});

const Backpack: NextPage = () => {

	const [dataSorted, setDataSorted] = useState<Map<string, LambdaWearable[]> | null>(null);
	const [isLoading, setLoading] = useState(false);
	const [backpackAddress, setBackpackAddress] = useState<string | undefined>();
	const [showFullWearableInfo, setShowFullWearableInfo] = useState(false);
	const [wearablesCount, setWearablesCount] = useState<number | null>();
	const [filterText, setFilterText] = useState<string | undefined>();
	const [filteredRarities, setFilteredRarities] = useState<Set<string>>(new Set<string>());
	const [filteredCategories, setFilteredCategories] = useState<Set<string>>(new Set<string>());
	const [availableCategories, setAvailableCategories] = useState<Set<string>>(new Set<string>());

	const {address: avatarAddress} = useWeb3Context();
	const router = useRouter();

	const {
		currentlyWearing,
		currentlyWearingMap,
		updateCurrentlyWearing,
		removeCategoryItem,
	} = useWearableContext();

	useEffect(() => {
		if (router.query && router.query.backpackAddress) {
			setBackpackAddress(router.query.backpackAddress as string);
			const {pathname, query} = router;
			router.replace({pathname}, undefined, {shallow: true});
		}
	},[router]);

	useEffect(() => {
		setLoading(true);

		fetchAllPlayerWearables(`${backpackAddress ? backpackAddress : avatarAddress}`)
			.then((wearableResp) => {

				if (!wearableResp) {
					return;
				}

				let totalWearables = 0;
				const wearablesByCategory = new Map();
				const availableCategories = new Set<string>();
				wearableResp.forEach((wearable: any) => {
					if (!wearable.definition) {
						console.log("No def found: " + JSON.stringify(wearable));
						return;
					}

					let curCategory = wearable.definition?.data?.category;
					if (!curCategory) {
						curCategory = "none";
					} else {
						availableCategories.add(curCategory);
					}

					let curForCategory = wearablesByCategory.get(curCategory);
					if (!curForCategory) {
						wearablesByCategory.set(curCategory, [wearable]);
					} else {
						wearablesByCategory.set(curCategory, [wearable, ...curForCategory]);
					}

					totalWearables++;
				});

				setAvailableCategories(availableCategories);
				setWearablesCount(totalWearables);
				setDataSorted(wearablesByCategory);
				setLoading(false);
			});
	}, [backpackAddress, avatarAddress]);


	const rarityRanks = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY", "MYTHIC", "UNIQUE"];


	const processSortOrder = (item1: LambdaWearable, item2: LambdaWearable) => {
		if (!item1.definition || !item2.definition) {
			return 0;
		}

		const item1Rarity = rarityRanks.indexOf(item1.definition.rarity.toUpperCase());
		const item2Rarity = rarityRanks.indexOf(item2.definition.rarity.toUpperCase());

		if (item1Rarity < item2Rarity) {
			return 1;
		} else if (item1Rarity == item2Rarity) {
			return 0;
		} else {
			return -1;
		}
	};

	const filterSectionItems = (item: LambdaWearable) => {
		if (!item.definition) {
			return false;
		}

		if (!filteredRarities || filteredRarities.size < 1)
			return true

		if (filteredRarities.has(item.definition.rarity.toUpperCase())) {
			return true;
		}

		return false;
	};

	const getSections = (wearableData: Map<string, LambdaWearable[]>) => {
		const allCategories: JSX.Element[] = [];
		wearableData.forEach((items, category) => {
			allCategories.push((
				<Grid sx={{
					borderBottom: "1px solid #242129", padding: "1em",
					background: "linear-gradient(-191deg, rgba(33,30,37,1) 0%, rgba(24,20,26,1) 100%);",
				}}
					  container>
					<Grid xs={12} sm={.8}>
						<h3>{getNameForCategory(category).toUpperCase()}</h3>
						<p className={backpackStyles.categoryCounts}>{items.length}</p>

						{getRemoveSectionItem(category)}
					</Grid>
					<Grid xs={12} sm={11} container>
						{items
							.filter(filterSectionItems)
							.sort(processSortOrder)
							.map(getSectionItem)}
					</Grid>
				</Grid>
			));
		});
		return allCategories;
	};

	const isCardSelected = (urn: string) => {
		return currentlyWearing && currentlyWearing.includes(urn);
	};

	const getRemoveSectionItem = (category: string) => {
		const unremovableCategories = ["upper_body", "lower_body", "feet", "hair", "facial_hair", "eyes"];
		if (unremovableCategories.includes(category) || !currentlyWearingMap.has(category)) {
			return <></>;
		}

		return (
			<Grid item xs={showFullWearableInfo ? 1.2 : .7}>
				<a
					onClick={() => {
						removeSectionItem(category);
					}}
					className={`${backpackStyles.removeButton}`}>
					<Clear/>
				</a>
			</Grid>
		);
	};

	const removeSectionItem = (category: string) => {
		removeCategoryItem(category);
	};

	const getSectionItem = (item: LambdaWearable) => {

		if (!item || !item.definition) {
			return <></>;
		}

		if (filterText
			&& (!item.definition.name?.toLowerCase().includes(filterText.toLowerCase())
				&& !item.definition.description?.toLowerCase().includes(filterText.toLowerCase()))) {
			return;
		}

		return (
			<Grid item
				  xs={showFullWearableInfo ? 6 : 4}
				  sm={showFullWearableInfo ? 4 : 2}
				  lg={showFullWearableInfo ? 1 : .75}
			>
				<a
					onClick={() => {
						sendUpdate(item);
					}}>
					<div
						className={`${homeStyles.card} ${isCardSelected(item.definition.id) ? homeStyles.selected : ""}  ${wearablesStyles[item.definition.rarity]}  `}>
						{/*<Image alt={item.definition.name} loader={customLoader}*/}
						{/*    // width={showFullWearableInfo? '150': '100'}*/}
						{/*    // height={showFullWearableInfo? '150': '100'}*/}
						{/*       fill*/}
						{/*       src={item.definition.thumbnail}/>*/}

						<img alt={item.definition.name} width={"100%"}
							 src={item.definition.thumbnail}/>

					</div>
				</a>
				{/*<a onMouseOver={(e) => handlePopoverOpen(e, item)}>+</a>*/}
				{showFullWearableInfo &&
                  <div
                    className={`${homeStyles.cardLabel} ${isCardSelected(item.definition.id) ? homeStyles.selected : ""}`}>
                    <p>
                      <a target={"_blank"} rel="noreferrer noopener"
                         href={getMktLinkFromUrn(item.urn)}>{item.definition?.name}</a>
                    </p>
                    <p>{item.definition.description}</p>
					  {/*<p>{item.definition.rarity}</p>*/}
                  </div>}
			</Grid>
		);
	};

	const sendUpdate = (item: LambdaWearable) => {
		//const iframe = document.getElementById("previewIframe") as HTMLIFrameElement;
		//setCurrentlyWearing([...currentlyWearing, item.urn])

		updateCurrentlyWearing(item.definition?.data.category, item.urn, item.definition?.name, item.definition?.thumbnail, item.definition?.rarity);

		// if (iframe && iframe.contentWindow) {
		//     sendMessage(iframe.contentWindow, PreviewMessageType.UPDATE, {
		//         options: {
		//             urns: [...currentlyWearing, item.urn]
		//         }
		//         ,
		//     })
		// }
	};

	function toggleShowFullWearableInfo() {
		setShowFullWearableInfo(!showFullWearableInfo);
	}

	return (
		<Grid container xs={12}>

			<Grid item xs={12} sm={2}
				  sx={{
					  background: "radial-gradient(circle, rgba(33,30,37,1) 0%, rgba(24,20,26,1) 100%)",
				  }}>

				<Grid xs={12}>
					<AccordionStyled disabled>
						<AccordionSummary
							expandIcon={<ExpandMore/>}
							aria-controls="panel3a-content"
							id="panel3a-header"
						>
							<Typography>Total
								Wearables: {wearablesCount}</Typography>
						</AccordionSummary>
					</AccordionStyled>
					<AccordionStyled>
						<AccordionSummary
							expandIcon={<ExpandMore/>}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<Typography>Rarity</Typography>
						</AccordionSummary>
						<AccordionDetails>
							{
								rarityRanks.map((r) => {
									const isSelected = filteredRarities.has(r.toUpperCase());

									return <ChipRarity label={r}
													   key={r.toUpperCase()}
													   variant={isSelected ? "outlined" : "filled"}
													   onClick={(e) => {
														   if (isSelected) {
															   filteredRarities.delete(r.toUpperCase());
															   setFilteredRarities(new Set(filteredRarities));
														   } else {
															   filteredRarities.add(r.toUpperCase());
															   setFilteredRarities(new Set(filteredRarities));
														   }
													   }}/>;
								})
							}
						</AccordionDetails>
					</AccordionStyled>
					<AccordionStyled>
						<AccordionSummary
							expandIcon={<ExpandMore/>}
							aria-controls="panel2a-content"
							id="panel2a-header"
						>
							<Typography>Categories</Typography>
						</AccordionSummary>
						<AccordionDetails>
							{
								Array.from(availableCategories).map((category) => {
									return <ChipRarity
										key={category}
										label={getNameForCategory(category)}/>;
								})
							}
						</AccordionDetails>
					</AccordionStyled>
					<AccordionStyled>
						<AccordionSummary
							expandIcon={<ExpandMore/>}
							aria-controls="panel3a-content"
							id="panel3a-header"
						>
							<Typography>Search</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<CssTextField id={"filterInput"}
										  variant="filled"
										  label={"Search by Name"}
										  InputProps={{
											  startAdornment: (
												  <InputAdornment
													  position="start">
													  <Search/>
												  </InputAdornment>
											  ),
										  }}
										  value={filterText}
										  onChange={(event => {
											  setFilterText(event.target.value);
										  })}/>

							<CssTextField id={"addressInput"}
										  variant="filled"
										  label={"Backpack Address"}
										  value={backpackAddress}
										  onChange={(event => {
											  setBackpackAddress(event.target.value);
										  })}/>


							<div className={backpackStyles.description}>


								<FormControlLabel
									control={<Checkbox
										id={"showFullWearableInfoCheckbox"}
										color={"secondary"}
										checked={showFullWearableInfo}
										onChange={toggleShowFullWearableInfo}/>}
									label="Show all wearable info"
								/>
							</div>
						</AccordionDetails>
					</AccordionStyled>
				</Grid>


				<Grid item className={backpackStyles.sticky} xs={12}>
					<Stack>
						<Box>
							{avatarAddress &&
                              <PreviewFrame avatarAddress={avatarAddress}
                                            height={"500px"}/>}
						</Box>
						<Grid container xs={12}>
							<CurrentlyWearing cardSize={2} showSave={true}/>
						</Grid>
					</Stack>
				</Grid>
			</Grid>

			<Grid container item xs={12} sm={10}
				  sx={{
					  borderLeft: "1px solid #211e25",
					  background: "radial-gradient(circle, rgba(33,30,37,1) 0%, rgba(24,20,26,1) 100%)",
				  }}>
				{isLoading && <div>Loading</div>}
				{!isLoading && dataSorted && getSections(dataSorted).map(section => {
					return section;
				})}

				{/*<Popover*/}
				{/*    id="mouse-over-popover"*/}
				{/*    open={open}*/}
				{/*    anchorEl={anchorEl}*/}
				{/*    anchorOrigin={{*/}
				{/*        vertical: 'bottom',*/}
				{/*        horizontal: 'left',*/}
				{/*    }}*/}
				{/*    transformOrigin={{*/}
				{/*        vertical: 'top',*/}
				{/*        horizontal: 'left',*/}
				{/*    }}*/}
				{/*    onClose={handlePopoverClose}*/}
				{/*>*/}
				{/*    <Typography*/}
				{/*        className={`${backpackStyles.popover}`} sx={{p: 1}}>{popoverContent}</Typography>*/}
				{/*</Popover>*/}
			</Grid>
		</Grid>
	);
};

export default Backpack;
