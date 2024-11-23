import "@/styles/globals.css";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import nav_styles from "@/styles/Nav.module.css";
import {Grid} from "@mui/material";
import {Web3ContextProvider} from "@/context/Web3Context";
import NavbarWalletConnect from "@/components/nav/NavbarWalletConnect";
import {ThemeContextProvider} from "utils/ThemeProvider";
import {WearableContextProvider} from "@/context/WearableContext";
import Navbar from "@/components/nav/Navbar";
import {Metadata} from "next";


export const metadata: Metadata = {
	title: "Closet | Decentraland",
	description: "Decentraland Closet - Wearable Manager - made by mattimus - Funded by Decentraland DAO",
	icons: [{rel: "icon", url: "/icon-48x48.png"}],
};


function ClosetApp({
	children,
}: {
	children: React.ReactNode
}) {

	// const router = useRouter();
	// const path = (/#!(\/.*)$/.exec(router.asPath) || [])[1];
	// if (path) {
	// 	router.replace(path);
	// }


	return (
		<html>
		<Head>
			<link href="https://ui.decentraland.org/styles.css"
				  rel="stylesheet"/>
			<link href="https://ui.decentraland.org/dark-theme.css"
				  rel="stylesheet"/>
		</Head>
		<body>
		<Web3ContextProvider>
			<WearableContextProvider>
				<ThemeContextProvider>
					<Grid className={nav_styles.navbar}
						  justifyContent={"center"} container xs={12}>
						<Grid container item xs={6} md={2}>
							<Grid container xs={10}>
								<Grid item xs={2}>
									<img alt={"Decentraland Logo"}
										 className={nav_styles.logo}
										 width={"48px"}
										 height={"48px"}
										 src="/icon-48x48.png"/>
								</Grid>
								<Grid item className={nav_styles.logo_name}
									  xs={2}>
									CLOSET
								</Grid>

							</Grid>
						</Grid>
						<Grid container md={2} justifyContent={"center"}>
							<Navbar/>
						</Grid>
						<Grid container justifyContent={"right"} xs={6}
							  md={2}>
							<NavbarWalletConnect/>
						</Grid>
					</Grid>
					<main>
						{children}
					</main>
				</ThemeContextProvider>
			</WearableContextProvider>
		</Web3ContextProvider>

		<footer className={styles.footer}>
			&copy; mattimus <br/>
			Powered by Decentraland DAO
		</footer>
		</body>
		</html>
	);
}

export default ClosetApp;
