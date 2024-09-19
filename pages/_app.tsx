import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { PrivyProvider } from "@privy-io/react-auth";
import { UserContextProvider } from "../components/contexts/UserContext";

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
        <UserContextProvider>
          <Component {...pageProps} />
        </UserContextProvider>
      </PrivyProvider>
    </>
  );
}

export default MyApp;
