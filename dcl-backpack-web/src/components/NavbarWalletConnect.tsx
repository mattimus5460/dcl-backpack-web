import {AppProps} from "next/app";
import {useWeb3Context} from "../context/Web3Context";
import {useState} from "react";
import {Grid} from "@mui/material";
import {Web3Button} from "./Web3Button";
import styles from "../../styles/Home.module.css";

function NavbarWalletConnect() {
    const {address: avatarAddress} = useWeb3Context()
    const [backpackAddress, setBackpackAddress] = useState<string | undefined>()

    return (
        <>
            <Grid xs={6}>
                {/*<form onSubmit={(e) => {*/}
                {/*    e.preventDefault()*/}
                {/*}}>*/}
                {/*<label className={styles.addressLabel}>*/}
                {/*    Avatar Address*/}
                {/*</label>*/}
                {avatarAddress && <div>{String(avatarAddress).substring(2, 6) +
                    "..." +
                    String(avatarAddress).substring(38)}</div>}

                {/*    <label className={styles.addressLabel}>*/}
                {/*        Backpack Address*/}
                {/*    </label>*/}
                {/*    <input type="text" id={'addressInput'} className={styles.addressInput}*/}
                {/*           value={backpackAddress}*/}
                {/*           onChange={(event => {*/}
                {/*               setBackpackAddress(event.target.value)*/}
                {/*           })}/>*/}
                {/*</form>*/}


            </Grid>

            <Grid xs={6}>

                <Web3Button/>
            </Grid>
        </>
    )
}

export default NavbarWalletConnect
