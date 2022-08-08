import {createTheme, ThemeProvider} from "@mui/system";
import {ReactNode} from "react";

export const ThemeContextProvider: React.FC<{children:ReactNode}> = ({children}) => {
    const theme = createTheme({
        palette: {
            primary: {
                main: "#fcba03",
            }
        }
    });

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};