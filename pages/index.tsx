import React from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
import { useState } from "react";
import styles from "./index.module.css";
import dynamic from "next/dynamic";
import { PrivyClient } from "@privy-io/server-auth";
import { GetServerSideProps } from "next";
import { usePrivy, useLogin, useSolanaWallets, User } from "@privy-io/react-auth";
import { hasExistingSolanaWallet } from "../utils";

const Home = dynamic(() => import("./home"));
const Apps = dynamic(() => import("./apps"));
const Swap = dynamic(() => import("./swap"));
const History = dynamic(() => import("./history"));
const Rewards = dynamic(() => import("./rewards"));

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookieAuthToken = req.cookies["privy-token"];
  if (!cookieAuthToken) return { props: {} };

  const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET;
  const client = new PrivyClient(PRIVY_APP_ID!, PRIVY_APP_SECRET!);

  try {
    const claims = await client.verifyAuthToken(cookieAuthToken);
    console.log({ claims });

    return {
      props: {},
      redirect: { destination: "/home", permanent: false },
    };
  } catch (error) {
    return { props: {} };
  }
};

export default function Main() {
  const [activePage, setActivePage] = useState("/home");

  const {createWallet} = useSolanaWallets();

  const {
    ready,
    authenticated,
  } = usePrivy();

  const { login } = useLogin({
    onComplete(user, _isNewUser, _wasAlreadyAuthenticated, _loginMethod, _loginAccount) {
      if(user) {
        if(!hasExistingSolanaWallet(user)) {
          createWallet();
        }
      }
    },
    onError: (error) => {
      console.log("Error logging in: ", error);
    }
  })

  const handleNavClick = (page: string) => {
    setActivePage(page);
  };

  const renderActivePage = () => {
    switch (activePage) {
      case "/home":
        return <Home />;
      case "/apps":
        return <Apps />;
      case "/swap":
        return <Swap />;
      case "/history":
        return <History />;
      case "/rewards":
        return <Rewards />;
      default:
        return <Home />;
    }
  };

  return (
    <div className={styles.mainContainer}>
      {
        ready && authenticated ?
          <div>
            <div className={styles.activePage}>
              {renderActivePage()}
            </div>
            <Navbar className={styles.navbar}>
              <Container className={styles.navContainer}>
                <Nav className={styles.nav}>
                  <Nav.Link
                    className={`${styles.navLink}`}
                    style={{
                      color: activePage === "/home" ? `red` : `black`,
                    }}
                    onClick={() => handleNavClick("/home")}
                  >
                    Home
                  </Nav.Link>
                  <Nav.Link
                    className={`${styles.navLink}`}
                    style={{
                      color: activePage === "/apps" ? `red` : `black`,
                    }}
                    onClick={() => handleNavClick("/apps")}
                  >
                    Apps
                  </Nav.Link>
                  <Nav.Link
                    className={`${styles.navLink}`}
                    style={{
                      color: activePage === "/swap" ? `red` : `black`,
                    }}
                    onClick={() => handleNavClick("/swap")}
                  >
                    Swap
                  </Nav.Link>
                  <Nav.Link
                    className={`${styles.navLink}`}
                    style={{
                      color: activePage === "/history" ? `red` : `black`,
                    }}
                    onClick={() => handleNavClick("/history")}
                  >
                    History
                  </Nav.Link>
                  <Nav.Link
                    className={`${styles.navLink}`}
                    style={{
                      color: activePage === "/rewards" ? `red` : `black`,
                    }}
                    onClick={() => handleNavClick("/rewards")}
                  >
                    Rewards
                  </Nav.Link>
                </Nav>
              </Container>
            </Navbar>
          </div>
        :
          <div className={styles.failedAuthenticationTextContainer}>
            <h1 className={styles.failedAuthenticationText}>Log in via Telegram</h1>
            <button
              onClick = {
                login
              }
            >
              Log in via Telegram
            </button>
          </div>
      }
    </div>
  );
}
