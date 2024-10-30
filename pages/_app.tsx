import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { PrivyProvider } from "@privy-io/react-auth";
import { WalletContextProvider } from "../components/contexts";
import { TransferContextProvider } from "../components/contexts/TransferContext";
import { JupiterSwapContextProvider } from "../components/contexts/JupiterSwapContext";
import { Analytics } from "@vercel/analytics/react";
import { useTelegram } from "../utils/twa";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const { disableVerticalSwipe } = useTelegram();

  useEffect(() => {
    const doStuff = () => {
      disableVerticalSwipe();
    };

    doStuff();
  }, []);

  return (
    <>
      <Head>
        <title>Kiwi - Solana wallet inside Telegram</title>
        <meta
          name="description"
          content="Kiwi - Solana wallet inside Telegram"
        />
      </Head>
      <script src="https://telegram.org/js/telegram-web-app.js"></script>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css"
        integrity="sha512-YWzhKL2whUzgiheMoBFwW8CKV4qpHQAEuvilg9FAn5VJUDwKZZxkJNuGM4XkWuk94WCrrwslk8yWNGmY1EduTA=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
      <WalletContextProvider>
        <TransferContextProvider>
          <JupiterSwapContextProvider>
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
              <Analytics />
            </PrivyProvider>
          </JupiterSwapContextProvider>
        </TransferContextProvider>
      </WalletContextProvider>
    </>
  );
}

export default MyApp;
