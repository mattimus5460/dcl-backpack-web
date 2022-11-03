import type {NextPage} from 'next'
import {Grid} from "@mui/material";
import {useWeb3Context} from "../src/context/Web3Context";
import PreviewFrame from '../src/components/wearables/PreviewFrame';
import CurrentlyWearing from "../src/components/wearables/CurrentlyWearing";

const Home: NextPage = () => {

    const {address: avatarAddress} = useWeb3Context()

    return (
        <Grid container justifyContent={'center'} xs={12}>
            <Grid xs={2}>
                {avatarAddress && <PreviewFrame avatarAddress={avatarAddress} height={'800px'}/>}
            </Grid>

            <Grid justifyContent={'center'} container xs={4}>
                <CurrentlyWearing cardSize={3}/>
            </Grid>
        </Grid>
    )
}

export default Home