import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { PrivyProvider } from "@privy-io/react-auth";
import { WalletContextProvider } from "../components/contexts";

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
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css"
        integrity="sha512-YWzhKL2whUzgiheMoBFwW8CKV4qpHQAEuvilg9FAn5VJUDwKZZxkJNuGM4XkWuk94WCrrwslk8yWNGmY1EduTA=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
      <WalletContextProvider>
        <PrivyProvider
          appId={process.env.NEXT_PRIVY_APP_ID || ""}
          config={{
            embeddedWallets: {
              createOnLogin: "off",
            },
            loginMethods: ["telegram"],
          }}
        >
          <Component {...pageProps} />
        </PrivyProvider>
      </WalletContextProvider>
    </>
  );
}

export default MyApp;
