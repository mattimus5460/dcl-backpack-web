import type {NextPage} from 'next'
import styles from '../styles/Home.module.css'
import {Box, Grid} from "@mui/material";

import {styled} from '@mui/material/styles';
import {useWeb3Context} from "../src/context/Web3Context";
import PreviewFrame from '../src/components/wearables/PreviewFrame';
import CurrentlyWearing from "../src/components/wearables/CurrentlyWearing";

const Home: NextPage = () => {

    const {address: avatarAddress} = useWeb3Context()

    const Item = styled(Box)(({theme}) => ({
        textAlign: 'center',
    }));

    return (
        <Grid container xs={12}>
            <Grid xs={12}>
                {avatarAddress && <PreviewFrame avatarAddress={avatarAddress} height={'800px'}/>}
            </Grid>

            <Grid alignItems={'center'} xs={12}>
                <Item>
                    <h2>Wearing</h2>
                </Item>

                <div className={styles.grid}>
                    <CurrentlyWearing/>
                </div>
            </Grid>
        </Grid>
    )
}

export default Home
