import '../styles/globals.css'
import type {AppProps} from 'next/app'
import Head from "next/head";
import {ThemeContextProvider} from "../src/utils/ThemeProvider";
import styles from "../styles/Home.module.css";
import nav_styles from "../styles/Nav.module.css";
import {Web3ContextProvider} from "../src/context/Web3Context";
import Navbar from "../src/components/nav/Navbar";
import {Grid} from "@mui/material";
import NavbarWalletConnect from "../src/components/nav/NavbarWalletConnect";
import {WearableContextProvider} from "../src/context/WearableContext";


function MyApp({Component, pageProps}: AppProps) {

    return (
        <>
            <Head>
                <title>Closet | Decentraland</title>
                <meta name="description" content="Decentraland Closet - Wearable Manager - made by mattimus"/>
                <link rel="icon" href="/icon-48x48.png"/>
            </Head>
            <Web3ContextProvider>
                <WearableContextProvider>
                    <ThemeContextProvider>
                        <Grid className={nav_styles.navbar} container xs={12}>
                            <Grid xs={3.5}>
                            </Grid>
                            <Grid container xs={2}>
                                <Grid container xs={10}>
                                    <Grid container xs={2}>
                                        <img className={nav_styles.logo} width={'48px'} height={'48px'}
                                             src="/icon-48x48.png"/>
                                    </Grid>
                                    <Grid className={nav_styles.logo_name} container xs={6}>
                                        CLOSET
                                    </Grid>

                                    <Navbar/>
                                </Grid>

                            </Grid>
                            <Grid xs={2.35}>
                            </Grid>
                            <Grid container xs={1}>
                                <NavbarWalletConnect/>
                            </Grid>
                        </Grid>
                        <main>
                            <Component {...pageProps} />
                        </main>
                    </ThemeContextProvider>
                </WearableContextProvider>
            </Web3ContextProvider>
            <footer className={styles.footer}>
                &copy; mattimus
            </footer>
        </>
    )
}

export default MyApp