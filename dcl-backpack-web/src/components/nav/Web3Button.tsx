import React from 'react'
import { useWeb3 } from '../../hooks/Web3Client'
import {useWeb3Context} from "../../context/Web3Context";
import {inspect} from "util";
import styles from '../../../styles/Home.module.css'

interface ConnectProps {
    connect: (() => Promise<void>) | null
}
const ConnectButton = ({ connect }: ConnectProps) => {
    return connect ? (
        <button className={`${styles.connectButton} ${styles.web3Button}`} onClick={connect}>Sign In</button>
    ) : (
        <button>Loading...</button>
)
}

interface DisconnectProps {
    disconnect: (() => Promise<void>) | null
}

const DisconnectButton = ({ disconnect }: DisconnectProps) => {
    return disconnect ? (
        <button className={`${styles.disconnectButton} ${styles.web3Button}`}  onClick={disconnect}>Sign Out</button>
    ) : (
        <button>Loading...</button>
)
}

export function Web3Button() {
    const { web3Provider, connect, disconnect } = useWeb3Context()

    return web3Provider ? (
        <DisconnectButton disconnect={disconnect} />
) : (
        <ConnectButton connect={connect} />
)
}