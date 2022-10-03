import '../styles/globals.css'
import type {AppProps} from 'next/app'
import Head from "next/head";
import {ThemeContextProvider} from "../src/utils/ThemeProvider";
import styles from "../styles/Home.module.css";
import {useWeb3Context, Web3ContextProvider} from "../src/context/Web3Context";
import Navbar from "../src/components/Navbar";
import {createTheme, Grid, StyledEngineProvider} from "@mui/material";
import {useState} from "react";
import NavbarWalletConnect from "../src/components/NavbarWalletConnect";
import {grey} from "@mui/material/colors";


function MyApp({Component, pageProps}: AppProps) {

    return (
        <>
            <Head>
                <title>Metaverse Closet</title>
                <meta name="description" content="Metaverse Closet - Wearable Manager - made by mattimus"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Web3ContextProvider>
                <ThemeContextProvider>
                    <Grid container xs={12}>
                        <Grid xs={2}>
                            DCL Closet
                        </Grid>
                        <Grid xs={8}>
                            <Navbar/>
                        </Grid>
                        <Grid xs={2}>
                            <NavbarWalletConnect/>
                        </Grid>
                    </Grid>
                    <main>
                        <Component {...pageProps} />
                    </main>
                </ThemeContextProvider>
            </Web3ContextProvider>
            <footer className={styles.footer}>
                &copy; mattimus
            </footer>
        </>

    )
}

export default MyApp
