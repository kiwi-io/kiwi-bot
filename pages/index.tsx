import React from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
import { useState } from "react";
import styles from "./index.module.css";
import dynamic from "next/dynamic";
import { usePrivy, useLogin, useSolanaWallets } from "@privy-io/react-auth";
import { hasExistingSolanaWallet } from "../utils";

const Home = dynamic(() => import("./home"));
const Apps = dynamic(() => import("./apps"));
const Swap = dynamic(() => import("./swap"));
const History = dynamic(() => import("./history"));
const Rewards = dynamic(() => import("./rewards"));

import NavButton from "../components/NavButton";

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
          <div className={styles.mainAuthenticatedContainer}>
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
                    <NavButton
                      name={"Home"}
                      iconClass={"fa-solid fa-house"}
                      isActive={activePage === "/home"}
                    />
                  </Nav.Link>
                  <Nav.Link
                    className={`${styles.navLink}`}
                    style={{
                      color: activePage === "/apps" ? `red` : `black`,
                    }}
                    onClick={() => handleNavClick("/apps")}
                  >
                    <NavButton
                      name={"Apps"}
                      iconClass={"fa-solid fa-rocket"}
                      isActive={activePage === "/apps"}
                    />
                  </Nav.Link>
                  <Nav.Link
                    className={`${styles.navLink}`}
                    style={{
                      color: activePage === "/swap" ? `red` : `black`,
                    }}
                    onClick={() => handleNavClick("/swap")}
                  >
                    <NavButton
                      name={"Swap"}
                      iconClass={"fa-solid fa-shuffle"}
                      isActive={activePage === "/swap"}
                    />
                  </Nav.Link>
                  <Nav.Link
                    className={`${styles.navLink}`}
                    style={{
                      color: activePage === "/history" ? `red` : `black`,
                    }}
                    onClick={() => handleNavClick("/history")}
                  >
                    <NavButton
                      name={"History"}
                      iconClass={"fa-solid fa-clock-rotate-left"}
                      isActive={activePage === "/history"}
                    />
                  </Nav.Link>
                  <Nav.Link
                    className={`${styles.navLink}`}
                    style={{
                      color: activePage === "/rewards" ? `red` : `black`,
                    }}
                    onClick={() => handleNavClick("/rewards")}
                  >
                    <NavButton
                      name={"Rewards"}
                      iconClass={"fa-solid fa-parachute-box"}
                      isActive={activePage === "/rewards"}
                    />
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
