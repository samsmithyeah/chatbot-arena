import "@/styles/normalize.css";

import "@/styles/global.css";
import "@mantine/core/styles.css";
//import "@mantine/notifications/styles.css";
import "@/styles/typing.css";

import { theme } from "@/styles/theme";
import { MantineProvider } from "@mantine/core";
import { AppProps } from "next/app";
import Head from "next/head";
import { ErrorBoundary } from "react-error-boundary";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Chatbot Battle Arena</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider theme={theme}>
        <ErrorBoundary
          fallback={<div></div>}
          onError={(e) => {
            console.error(e);
          }}
        >
          <Component {...pageProps} />
        </ErrorBoundary>
      </MantineProvider>
    </>
  );
}
