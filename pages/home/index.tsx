import React, { useEffect } from "react";
import styles from "./home.module.css";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import TokenDisplay from "../../components/TokenDisplay";
import { useWalletContext } from "../../components/contexts";
import { WALLET_UPDATE_FREQUENCY_IN_MS } from "../../constants";
import { formatWithCommas } from "../../utils";

const Home = () => {

  const router = useRouter();

  const {
    user,
    ready,
    authenticated
  } = usePrivy();

  const {
    portfolio,
    updatePortfolio
  } = useWalletContext();

  useEffect(() => {
    const intervalId = setInterval(() => {
      updatePortfolio(user);
    }, WALLET_UPDATE_FREQUENCY_IN_MS);

    return () => clearInterval(intervalId);
  }, [portfolio]);

  const navigateToSettings = () => {
    router.push('/settings');
  }

  return(
    <div className={styles.container}>
      {
        ready && authenticated && user ?
          <div className={styles.mainContainer}>
            <div className={styles.headerAndOverviewContainer}>
              <div className={styles.headerContainer}>
                <div className={styles.usernameContainer}>
                    <div>{`${user.telegram?.username}`}</div>
                </div>
                <div
                  className={styles.settingsContainer}
                  onClick={
                    () => {
                      navigateToSettings()
                    }
                  }
                >
                  <div>
                    {/* <i className="fa-solid fa-gear"></i> */}
                  </div>
                </div>
              </div>
              <div className={styles.overviewContainer}>
                <div className={styles.balanceContainer}>
                  <div className={styles.balanceValue}>
                    <span className={styles.dollarSign}>{`$ `}</span>
                    <span className={styles.balance}>{formatWithCommas(portfolio.totalUsd.toFixed(2))}</span>
                  </div>
                </div>
                <div className={styles.actionButtonsContainer}>
                  <div className={styles.receiveButtonContainer}>
                    <button className={`${styles.actionButton} ${styles.receiveButton}`}>
                      <span className={`${styles.actionButtonIcon } ${styles.receiveButtonIcon} fa-solid fa-download`}></span>
                      <span>Receive</span>
                    </button>
                  </div>
                  <div className={styles.sendButtonContainer}>
                    <button className={`${styles.actionButton} ${styles.sendButton}`}>
                      <span className={`${styles.actionButtonIcon} ${styles.sendButtonIcon} fa-solid fa-upload`}></span>
                      <span>Send</span>
                    </button>
                  </div>
                  <div className={styles.copyButtonContainer}>
                    <button className={`${styles.actionButton} ${styles.copyButton}`}>
                      <span className={`${styles.actionButtonIcon} ${styles.copyButtonIcon} fa-solid fa-copy`}></span>
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              </div>
            </div> 
            {
              portfolio ?
                <div className={styles.tokensOuterContainer}>
                  <div className={styles.tokensContainer}>
                    {
                      portfolio.items ?
                        <>
                          {
                            portfolio.items.map((token, _) => {
                              return (
                                token.valueUsd > 1 ?
                                  <div className={styles.tokenDisplayContainer} key={token.address}>
                                    <TokenDisplay tokenItem={token} />
                                  </div>
                                :
                                  <></>
                              )
                            })
                          }
                        </>
                      :
                        <></>
                    }
                  </div>
                </div>
              :
                <></>
            }
          </div>
        :
          <div>
            <p>User not logged in</p>
          </div>
      }
    </div>
  );
};

export default Home;
