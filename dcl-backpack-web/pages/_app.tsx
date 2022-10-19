import '../styles/globals.css'
import type {AppProps} from 'next/app'
import Head from "next/head";
import {ThemeContextProvider} from "../src/utils/ThemeProvider";
import styles from "../styles/Home.module.css";
import {useWeb3Context, Web3ContextProvider} from "../src/context/Web3Context";
import Navbar from "../src/components/nav/Navbar";
import {createTheme, Grid, StyledEngineProvider} from "@mui/material";
import {useState} from "react";
import NavbarWalletConnect from "../src/components/nav/NavbarWalletConnect";
import {grey} from "@mui/material/colors";
import {WearableContextProvider} from "../src/context/WearableContext";


function MyApp({Component, pageProps}: AppProps) {

    return (
        <>
            <Head>
                <title>Decentraland Closet</title>
                <meta name="description" content="Decentraland Closet - Wearable Manager - made by mattimus"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Web3ContextProvider>
                <WearableContextProvider>
                    <ThemeContextProvider>
                        <Grid container xs={12}>
                            <Grid xs={2}>
                            </Grid>
                            <Grid container xs={8}>
                                <Grid xs={10}>
                                    <h1>DCL Closet</h1>
                                    <Navbar/>
                                </Grid>

                                <Grid sx={{padding:'1em'}} container xs={2}>
                                    <NavbarWalletConnect/>
                                </Grid>
                            </Grid>
                            <Grid xs={2}>
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
