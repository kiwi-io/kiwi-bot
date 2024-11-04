import React, { useEffect } from "react";
import styles from "./home.module.css";
import { usePrivy, useSolanaWallets } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import TokenDisplay from "../../components/TokenDisplay";
import { useWalletContext } from "../../components/contexts";
import { WALLET_UPDATE_FREQUENCY_IN_MS } from "../../constants";
import {
  decodeTelegramCompatibleUrl,
  formatWithCommas,
  hasExistingSolanaWallet,
} from "../../utils";
import { useTelegram } from "../../utils/twa";
import { DEFAULT_TOKENS_LIST } from "../../constants";
import { useJupiterSwapContext } from "../../components/contexts/JupiterSwapContext";
import { useActivePageContext } from "../../components/contexts/ActivePageContext";

const Home = () => {
  const router = useRouter();

  const { user, ready, authenticated } = usePrivy();

  const { portfolio, updatePortfolio, updateTransactionHistory } = useWalletContext();
  const { updateReferralSession, updateActivePage } = useActivePageContext();

  const {
    updateSide,
    updateTokenIn,
    updateTokenInData,
    updateTokenOut,
    updateTokenOutData,
    updateReferrer,
    updateActionHost,
    updateActionHostLogo,
  } = useJupiterSwapContext();

  const { createWallet } = useSolanaWallets();

  useEffect(() => {
    const intervalId = setInterval(() => {
      updatePortfolio(user);
      updateTransactionHistory(user);
    }, WALLET_UPDATE_FREQUENCY_IN_MS);

    return () => clearInterval(intervalId);
  }, [portfolio]);

  useEffect(() => {
    const doStuff = () => {
      if (user) {
        if (!hasExistingSolanaWallet(user)) {
          createWallet();
        }
        updatePortfolio(user);
        updateTransactionHistory(user);
      }
    };

    doStuff();
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.push("/");
    }

    //@ts-ignore
    const startParam = window.Telegram.WebApp.initDataUnsafe.start_param;
    if (startParam && user) {
      if (startParam.startsWith("buy")) {
        updateSide("buy");
        const components = startParam.split("-");

        const token = components[1];
        const referrer = components[2];

        updateTokenIn(token);
        updateTokenInData(token);

        updateTokenOut(`So11111111111111111111111111111111111111112`);
        updateTokenOutData(`So11111111111111111111111111111111111111112`);

        updateReferrer(referrer);
        updateActionHost("https://jup.ag/swap");
        updateActionHostLogo("/logos/jupiter_logo.svg");
        updateActivePage("/swap");
        updateReferralSession("/swap");
      } else if (startParam.startsWith("sell")) {
        updateSide("sell");
        const components = startParam.split("-");

        const token = components[1];
        const referrer = components[2];

        updateTokenIn(`So11111111111111111111111111111111111111112`);
        updateTokenInData(`So11111111111111111111111111111111111111112`);

        updateTokenOut(token);
        updateTokenOutData(token);

        updateReferrer(referrer);
        updateActionHost("https://jup.ag/swap");
        updateActionHostLogo("/logos/jupiter_logo.svg");
        updateActivePage("/swap");
        updateReferralSession("/swap");
      } else {
        const decodedUrl = decodeTelegramCompatibleUrl(startParam);

        console.log("Action to be taken: ", decodedUrl);
      }
    }
  }, []);

  const navigateToAllTokens = (target: string) => {
    if (user && ready && authenticated) {
      router.push(`/tokens?navigateTo=${target}`);
    }
  };

  const navigateToReceive = () => {
    if (user && ready && authenticated) {
      router.push(`/receive`);
    }
  };

  const { vibrate } = useTelegram();

  return (
    <div className={styles.container}>
      {ready && authenticated && user ? (
        <div className={styles.mainContainer}>
          <div className={styles.headerAndOverviewContainer}>
            <div className={styles.headerContainer}>
              <div className={styles.usernameContainer}>
                <div>{`${user.telegram?.username ? user.telegram?.username : user.telegram.firstName}`}</div>
              </div>
              <div
                className={styles.settingsContainer}
                onClick={() => {
                  // navigateToSettings();
                }}
              >
                <div>{/* <i className="fa-solid fa-gear"></i> */}</div>
              </div>
            </div>
            <div className={styles.overviewContainer}>
              <div className={styles.balanceContainer}>
                <div className={styles.balanceValue}>
                  <span className={styles.dollarSign}>{`$ `}</span>
                  <span className={styles.balance}>
                    {formatWithCommas(portfolio.totalUsd.toFixed(2))}
                  </span>
                </div>
              </div>
              <div className={styles.actionButtonsContainer}>
                <div className={styles.receiveButtonContainer}>
                  <button
                    className={`${styles.actionButton} ${styles.receiveButton}`}
                    onClick={() => {
                      vibrate("medium");
                      navigateToReceive();
                    }}
                  >
                    <span
                      className={`${styles.actionButtonIcon} ${styles.receiveButtonIcon} fa-solid fa-download`}
                    ></span>
                    <span>Deposit</span>
                  </button>
                </div>
                <div className={styles.sendButtonContainer}>
                  <button
                    className={`${styles.actionButton} ${styles.sendButton}`}
                    onClick={() => {
                      vibrate("heavy");
                      navigateToAllTokens("send");
                    }}
                  >
                    <span
                      className={`${styles.actionButtonIcon} ${styles.sendButtonIcon} fa-solid fa-upload`}
                    ></span>
                    <span>Withdraw</span>
                  </button>
                </div>
                {/* <div className={styles.copyButtonContainer}>
                  <button
                    className={`${styles.actionButton} ${styles.copyButton}`}
                    onClick={() => {
                      vibrate("soft");
                      copyToClipboard(user.wallet.address);
                    }}
                  >
                    <span
                      className={`${styles.actionButtonIcon} ${styles.copyButtonIcon} fa-solid fa-copy`}
                    ></span>
                    <span>Copy</span>
                  </button>
                </div> */}
              </div>
            </div>
          </div>
          {portfolio ? (
            <div className={styles.tokensOuterContainer}>
              <div className={styles.tokensContainer}>
                {portfolio.items.length > 0 ? (
                  <>
                    {portfolio.items.map((token, _) => {
                      return token.valueUsd >= 0 ? (
                        <div
                          className={styles.tokenDisplayContainer}
                          key={token.address}
                        >
                          <TokenDisplay tokenItem={token} showUsdValue={true} />
                        </div>
                      ) : (
                        <></>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {DEFAULT_TOKENS_LIST.map((token, _) => {
                      return (
                        <div
                          className={styles.tokenDisplayContainer}
                          key={token.address}
                        >
                          <TokenDisplay tokenItem={token} showUsdValue={true} />
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.tokensOuterContainer}>
              <div className={styles.tokensContainer}>
                {
                  <>
                    {DEFAULT_TOKENS_LIST.map((token, _) => {
                      return (
                        <div
                          className={styles.tokenDisplayContainer}
                          key={token.address}
                        >
                          <TokenDisplay tokenItem={token} showUsdValue={true} />
                        </div>
                      );
                    })}
                  </>
                }
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p>User not logged in</p>
        </div>
      )}
    </div>
  );
};

export default Home;
