import {ImageLoaderProps} from "next/image";

const customLoader = ({ src }:ImageLoaderProps) => {
    return src
}

export default customLoader;