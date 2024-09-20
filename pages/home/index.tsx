import React from "react";
import styles from "./home.module.css";
import { usePrivy } from "@privy-io/react-auth";

const Home = () => {

  const {
    user,
    ready,
    authenticated
  } = usePrivy();

  return(
    <div className={styles.container}>
      {
        ready && authenticated && user ?
          <div className={styles.mainContainer}>
            <div className={styles.headerAndOverviewContainer}>
              <div className={styles.headerContainer}>
                <div className={styles.usernameAndAddressContainer}>
                  <div className={styles.usernameContainer}>
                    <p>{`${user.telegram?.username}`}</p>
                  </div>
                  <div className={styles.addressClipboardContainer}>
                    <p>{`0`}</p>
                  </div>
                </div>
                <div className={styles.settingsContainer}>
                    <div>{`S`}</div>
                </div>
              </div>
              <div className={styles.overviewContainer}>
                <p>Welcome to Kiwi, {`${user?.telegram?.firstName}`}</p>
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
