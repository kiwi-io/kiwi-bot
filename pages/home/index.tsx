import React from "react";
import styles from "./home.module.css";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/router";

const Home = () => {

  const router = useRouter();

  const {
    user,
    ready,
    authenticated
  } = usePrivy();

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
                    <i className="fa-solid fa-gear"></i>
                  </div>
                </div>
              </div>
              <div className={styles.overviewContainer}>
                <div className={styles.balanceContainer}>
                  <div className={styles.balanceTitle}>
                    Balance
                  </div>
                  <div className={styles.balanceValue}>
                    <span className={styles.dollarSign}>{`$ `}</span>
                    <span className={styles.balance}>69,420.00</span>
                  </div>
                </div>
                <div className={styles.actionButtonsContainer}>
                  <div className={styles.depositButtonContainer}>
                    <button className={`${styles.actionButton} ${styles.depositButton}`}>
                      {`${<i className="fa-solid fa-download"></i>} Deposit`}
                    </button>
                  </div>
                  <div className={styles.withdrawButtonContainer}>
                    <button className={`${styles.actionButton}`}>
                      {`${<i className="fa-solid fa-upload"></i>} Withdraw`}
                    </button>
                  </div>
                  <div className={styles.refreshButtonContainer}>
                    <button className={`${styles.actionButton}`}>
                      {`${<i className="fa-solid fa-rotate"></i>} Refresh`}
                    </button>
                  </div>
                </div>
              </div>
            </div> 
            <div className={styles.tokensContainer}>
              <p>Your tokens come here</p>
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
