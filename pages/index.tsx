import React, { useState, useEffect } from "react";
// import { Nav, Navbar, Container } from "react-bootstrap";
import styles from "./index.module.css";
import dynamic from "next/dynamic";
import { useTelegramLogin, useDynamicContext } from "@dynamic-labs/sdk-react-core";

const Home = dynamic(() => import("./home"));

// import NavButton from "../components/NavButton";
import { useWalletContext } from "../components/contexts";

export default function Main() {
  const [activePage, _setActivePage] = useState("/home");
  const [loginTimeout, setLoginTimeout] = useState(false);

  const { sdkHasLoaded, user, primaryWallet } = useDynamicContext();
  const { telegramSignIn } = useTelegramLogin();
  
  const { updatePortfolio } = useWalletContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      if(sdkHasLoaded) {
        setLoginTimeout(true);
      }
    }, 60000);

    return () => clearTimeout(timer);
  }, [sdkHasLoaded]);

  useEffect(() => {
    if (!sdkHasLoaded) return;

    const signIn = async () => {
      if (!user) {
        await telegramSignIn({ forceCreateUser: true });
      }
    };

    const loadPortfolio = async() => {
      if(user) {
        updatePortfolio(primaryWallet);
      }
    }

    signIn();
    loadPortfolio();
  }, [sdkHasLoaded]);


  // const handleNavClick = (page: string) => {
  //   setActivePage(page);
  // };

  const renderActivePage = () => {
    switch (activePage) {
      case "/home":
        return <Home />;
      case "/apps":
        return <Home />;
      case "/swap":
        return <Home />;
      case "/history":
        return <Home />;
      case "/rewards":
        return <Home />;
      default:
        return <Home />;
    }
  };

  return (
    <div className={styles.mainContainer}>
      {sdkHasLoaded && user ? (
        <div className={styles.mainAuthenticatedContainer}>
          <div className={styles.activePage}>{renderActivePage()}</div>
          {/* <Navbar className={styles.navbar}>
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
            </Navbar> */}
        </div>
      ) : loginTimeout ? (
        <div className={styles.failedAuthenticationTextContainer}>
          <h1 className={styles.failedAuthenticationText}>Failed to log in</h1>
        </div>
      ) : (
        <div className={styles.loadingContainer}>
          <h1 className={styles.loadingText}>Authenticating via Telegram...</h1>
          <div className={styles.loader}></div>
        </div>
      )}
    </div>
  );
}
