import { createTheme } from "@mantine/core";
import { Roboto, Roboto_Mono } from "next/font/google";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  weight: ["100", "300", "400", "500", "700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

export const theme = createTheme({
  fontFamily: roboto.style.fontFamily,
  fontFamilyMonospace: robotoMono.style.fontFamily,
  headings: {
    fontFamily: roboto.style.fontFamily,
    sizes: {
      h1: {
        fontSize: "44px",
        fontWeight: "700",
        lineHeight: "57px",
      },
      h2: {
        fontSize: "36px",
        fontWeight: "700",
        lineHeight: "47px",
      },
      h3: {
        fontSize: "28px",
        fontWeight: "700",
        lineHeight: "36px",
      },
      h4: {
        fontSize: "22px",
        fontWeight: "700",
        lineHeight: "31px",
      },
      h5: {
        fontSize: "18px",
        fontWeight: "700",
        lineHeight: "26px",
      },
      h6: {
        fontSize: "16px",
        fontWeight: "700",
        lineHeight: "24px",
      },
    },
  },
  fontSizes: {
    xl: "1.5rem",
  },
  breakpoints: {
    xs: "37.5em",
    lg: "80em",
    xl: "90em",
    xxl: "100em",
  },
});
