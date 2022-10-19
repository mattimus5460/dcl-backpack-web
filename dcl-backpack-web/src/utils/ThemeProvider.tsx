import {ReactNode} from "react";
import {createTheme, ThemeProvider} from "@mui/material";

export const ThemeContextProvider: React.FC<{children:ReactNode}> = ({children}) => {
    const theme = createTheme({
        palette: {
            primary: {
                main: "#18141a",
            },
            text: {
                primary: "#FFF"
            },
            background: {
                paper: "#18141a"
            }
        }

    });

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};