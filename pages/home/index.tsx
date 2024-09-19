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
      Home
      <div>
        {
          ready && authenticated && user ?
            <div>
              <p>Welcome to Kiwi, {`${user?.telegram?.firstName}`}</p>
            </div>
          :
            <div>
              <p>User not logged in</p>
            </div>
        }
      </div>
    </div>
  );
};

export default Home;
