import React, { useEffect } from "react";
import styles from "./home.module.css";
import { usePrivy, useMfaEnrollment } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import TokenDisplay from "../../components/TokenDisplay";
import { useWalletContext } from "../../components/contexts";
import { WALLET_UPDATE_FREQUENCY_IN_MS } from "../../constants";
import { formatWithCommas } from "../../utils";
import { useTelegram } from "../../utils/twa";
import { DEFAULT_TOKENS_LIST } from "../../constants";
import { initBiometryManager } from "@telegram-apps/sdk";

const Home = () => {
  const router = useRouter();

  const { user, ready, authenticated } = usePrivy();
  const { showMfaEnrollmentModal } = useMfaEnrollment();

  const { portfolio, updatePortfolio } = useWalletContext();

  useEffect(() => {
    const intervalId = setInterval(() => {
      updatePortfolio(user);
    }, WALLET_UPDATE_FREQUENCY_IN_MS);

    return () => clearInterval(intervalId);
  }, [portfolio]);

  useEffect(() => {
    const doStuff = async () => {
      if(user.mfaMethods.filter((mfaMethod) => mfaMethod === "passkey").length === 0) {
        if(window) {
          const [biometryManager] = initBiometryManager();
          
          (await biometryManager).requestAccess({
            reason: "Passkey verification"
          }).then((response) => {
            console.log("Access granted: ", response);
            showMfaEnrollmentModal();
          })
        }
      }
    }

    doStuff();
  }, [user, authenticated]);

  const navigateToSettings = () => {
    router.push("/settings");
  };

  const navigateToReceive = () => {
    if (user && ready && authenticated) {
      router.push("/receive");
    }
  };

  const navigateToAllTokens = () => {
    if (user && ready && authenticated) {
      router.push("/tokens");
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const { vibrate } = useTelegram();

  return (
    <div className={styles.container}>
      {ready && authenticated && user ? (
        <div className={styles.mainContainer}>
          <div className={styles.headerAndOverviewContainer}>
            <div className={styles.headerContainer}>
              <div className={styles.usernameContainer}>
                <div>{`${user.telegram?.username}`}</div>
              </div>
              <div
                className={styles.settingsContainer}
                onClick={() => {
                  navigateToSettings();
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
                    <span>Receive</span>
                  </button>
                </div>
                <div className={styles.sendButtonContainer}>
                  <button
                    className={`${styles.actionButton} ${styles.sendButton}`}
                    onClick={() => {
                      vibrate("heavy");
                      navigateToAllTokens();
                    }}
                  >
                    <span
                      className={`${styles.actionButtonIcon} ${styles.sendButtonIcon} fa-solid fa-upload`}
                    ></span>
                    <span>Send</span>
                  </button>
                </div>
                <div className={styles.copyButtonContainer}>
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
                </div>
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
