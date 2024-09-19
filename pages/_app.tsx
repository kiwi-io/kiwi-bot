import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { PrivyProvider } from "@privy-io/react-auth";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Kiwi - Solana wallet inside Telegram</title>
        <meta
          name="description"
          content="Kiwi - Solana wallet inside Telegram"
        />
      </Head>
      <PrivyProvider
        appId={process.env.NEXT_PRIVY_APP_ID || ""}
        config={{
          embeddedWallets: {
            createOnLogin: "all-users",
          },
          loginMethods: ["telegram"],
        }}
      >
        <Component {...pageProps} />
      </PrivyProvider>
    </>
  );
}

export default MyApp;
