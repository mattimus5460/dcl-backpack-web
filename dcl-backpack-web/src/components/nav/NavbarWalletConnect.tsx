import {AppProps} from "next/app";
import {useWeb3Context} from "../../context/Web3Context";
import {useEffect, useState} from "react";
import {Grid} from "@mui/material";
import {Web3Button} from "./Web3Button";
import styles from "../../../styles/Home.module.css";
import {fetchPlayerDataProfileSnapshot} from "../../../pages/api/wearables/[...params]";
import {useWearableContext} from "../../context/WearableContext";

function NavbarWalletConnect() {
    const {address: avatarAddress} = useWeb3Context()
    const {profile} = useWearableContext()

    return (
        <>
            <Grid sx={{textAlign:'right'}} xs={6}>
                {/*<form onSubmit={(e) => {*/}
                {/*    e.preventDefault()*/}
                {/*}}>*/}
                {/*<label className={styles.addressLabel}>*/}
                {/*    Avatar Address*/}
                {/*</label>*/}
                {/*{avatarAddress && <div>{String(avatarAddress).substring(2, 6) +*/}
                {/*    "..." +*/}
                {/*    String(avatarAddress).substring(38)}</div>}*/}



                {profile.snapshot && <img className={styles.profileImage} src={profile.snapshot} alt={'user avatar photo'}/> }


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

            <Grid sx={{paddingTop:'.28em'}} xs={6}>

                {profile.name && <div>{profile.name}</div>}
                <Web3Button/>
            </Grid>
        </>
    )
}

export default NavbarWalletConnect
