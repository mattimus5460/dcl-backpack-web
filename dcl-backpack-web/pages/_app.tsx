import '../styles/globals.css'
import type {AppProps} from 'next/app'
import Head from "next/head";
import {ThemeContextProvider} from "../src/utils/ThemeProvider";
import styles from "../styles/Home.module.css";
import {Web3ContextProvider} from "../src/context/Web3Context";


function MyApp({Component, pageProps}: AppProps) {
    return (
        <>
            <Head>
                <title>DCL Closet</title>
                <meta name="description" content="DCL Closet - Wearable Manager - made by mattimus"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Web3ContextProvider>
                <ThemeContextProvider>
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
