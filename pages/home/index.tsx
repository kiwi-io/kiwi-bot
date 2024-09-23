import React, { useEffect } from "react";
import styles from "./home.module.css";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import TokenDisplay from "../../components/TokenDisplay";
import { useWalletContext } from "../../components/contexts";
import { WALLET_UPDATE_FREQUENCY_IN_MS } from "../../constants";

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
                  <div className={styles.balanceTitle}>
                    Balance
                  </div>
                  <div className={styles.balanceValue}>
                    <span className={styles.dollarSign}>{`$`}</span>
                    <span className={styles.balance}>{portfolio.totalUsd.toFixed(2)}</span>
                  </div>
                </div>
                <div className={styles.actionButtonsContainer}>
                  <div className={styles.depositButtonContainer}>
                    <button className={`${styles.actionButton} ${styles.depositButton}`}>
                      {/* <span className={`${styles.actionButtonIcon} fa-solid fa-download`}></span> */}
                      <span>Deposit</span>
                    </button>
                  </div>
                  <div className={styles.withdrawButtonContainer}>
                    <button className={`${styles.actionButton}`}>
                      {/* <span className={`${styles.actionButtonIcon} fa-solid fa-upload`}></span> */}
                      <span>Withdraw</span>
                    </button>
                  </div>
                  <div className={styles.copyButtonContainer}>
                    <button className={`${styles.actionButton}`}>
                      {/* <span className={`${styles.actionButtonIcon} fa-solid fa-copy`}></span> */}
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              </div>
            </div> 
            <div className={styles.tokensOuterContainer}>
              <div className={styles.tokensContainer}>
                {
                  portfolio && portfolio.items ?
                    <>
                      {
                        portfolio.items.map((token, _) => {
                          return (
                            <div className={styles.tokenDisplayContainer} key={token.address}>
                              <TokenDisplay tokenItem={token} />
                            </div>
                          )
                        })
                      }
                    </>
                  :
                    <></>
                }
              </div>
            </div>
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
