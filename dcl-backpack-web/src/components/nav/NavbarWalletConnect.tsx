import {Avatar, Grid} from "@mui/material";
import {Web3Button} from "./Web3Button";
import styles from "../../../styles/Nav.module.css";
import {useWearableContext} from "../../context/WearableContext";

function NavbarWalletConnect() {
    const {profile} = useWearableContext()

    return (
        <>
            <Grid xs={6}>
                {profile.name && <div className={styles.profileName}>{profile.name}</div>}
                <Web3Button/>
            </Grid>
            <Grid sx={{textAlign: 'left'}} xs={6}>
                {profile.snapshot ?
                    <Avatar className={styles.profileImage} alt={profile.name} src={profile.snapshot}/>
                    :
                    <></>}
            </Grid>
        </>
    )
}

export default NavbarWalletConnect