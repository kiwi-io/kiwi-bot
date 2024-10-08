import React, { useEffect } from "react";
import styles from "./home.module.css";
import { usePrivy, useSolanaWallets } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import TokenDisplay from "../../components/TokenDisplay";
import { useWalletContext } from "../../components/contexts";
import { WALLET_UPDATE_FREQUENCY_IN_MS } from "../../constants";
import { decodeTelegramCompatibleUrl, formatWithCommas, hasExistingSolanaWallet } from "../../utils";
import { useTelegram } from "../../utils/twa";
import { DEFAULT_TOKENS_LIST } from "../../constants";
import { useTransferContext } from "../../components/contexts/TransferContext";

const Home = () => {
  const router = useRouter();

  const { user, ready, authenticated } = usePrivy();

  const { portfolio, updatePortfolio } = useWalletContext();

  const { createWallet } = useSolanaWallets();

  const { updateToken, updateRecipient, updateAmount } = useTransferContext();

  useEffect(() => {
    const intervalId = setInterval(() => {
      updatePortfolio(user);
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
      }
    }

    doStuff();
  }, [user]);

  useEffect(() => {
    if(!user) {
      router.push("/home");
    }
    
    //@ts-ignore
    const startParam = window.Telegram.WebApp.initDataUnsafe.start_param;
    if(startParam && user) {
      if(startParam.startsWith("send")) {
        const components = startParam.split("-");
        console.log("Components: ", components);

        const action = components[0]; // 4

        let address = undefined;
        if(components.length >= 2) {
          address = components[1]; // 44
        }

        let tokenSymbol = undefined;
        if(components.length >= 3) {
          tokenSymbol = components[2]; 
        }

        let amount = undefined;
        if(components.length == 4) {
          amount = components[3]; 
        }
        
        if(action === "send" && portfolio) {
          if (tokenSymbol && portfolio && portfolio.items.length > 0) {
            const tokenItem = portfolio.items.filter(
              (item) => item.symbol === tokenSymbol,
            )[0];
    
            updateToken(tokenItem);
          }

          updateRecipient(address);
          updateAmount(amount);

          let targetUrl = `/send-transaction-confirmation`;
          router.push(targetUrl);
        }
      }
      else if(startParam.startsWith("jup")) {
        console.log("starts with jup");
        const components = startParam.split("-");

        const actionLink = components[1];
        console.log("components: ", components);
        console.log("passing: ", actionLink);
        router.push("/transaction-confirmation?actionUrl=", actionLink);        
      }
      else {
        const decodedUrl = decodeTelegramCompatibleUrl(startParam);

        console.log("Action to be taken: ", decodedUrl);
      }
    }
  }, []);

  const navigateToSettings = () => {
    router.push("/settings");
  };
  
  const navigateToAllTokens = (target: string) => {
    if (user && ready && authenticated) {
      router.push(`/tokens?navigateTo=${target}`);
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
                      navigateToAllTokens("receive");
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
                      navigateToAllTokens("send");
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
