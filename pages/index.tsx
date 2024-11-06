import React, { useState, useEffect } from "react";
// import { Nav, Navbar, Container } from "react-bootstrap";
import styles from "./index.module.css";
import dynamic from "next/dynamic";
import {
  usePrivy,
  useLogin,
  useSolanaWallets,
  User,
  SolanaFundingConfig,
} from "@privy-io/react-auth";
//@ts-ignore
import { useFundWallet } from "@privy-io/react-auth/solana";
import { hasExistingSolanaWallet } from "../utils";

const Home = dynamic(() => import("./home"));
const Swap = dynamic(() => import("./swap"));
const History = dynamic(() => import("./history"));

// import NavButton from "../components/NavButton";
import { useWalletContext } from "../components/contexts";
import { Container, Nav, Navbar } from "react-bootstrap";
import NavButton from "../components/NavButton";
import { useTelegram } from "../utils/twa";
import { useActivePageContext } from "../components/contexts/ActivePageContext";
import { Connection, PublicKey } from "@solana/web3.js";

export default function Main() {
  const [loginTimeout, setLoginTimeout] = useState(false);

  const { createWallet } = useSolanaWallets();

  const { updatePortfolio, updateTransactionHistory } = useWalletContext();

  const { ready, authenticated } = usePrivy();

  const { activePage, referralSession, updateActivePage } =
    useActivePageContext();

  const { vibrate } = useTelegram();

  const { fundWallet } = useFundWallet();

  const promptFundingIfNeeded = async (user: User) => {
    const connection = new Connection(process.env.NEXT_RPC_MAINNET_URL);
    const balance = await connection.getBalance(
      new PublicKey(user.wallet.address),
    );

    if (balance < 0.01) {
      fundWallet(user.wallet.address, {
        cluster: { name: 'mainnet-beta', rpcUrl: process.env.NEXT_RPC_MAINNET_URL },
        amount: `0.01`,
      } as SolanaFundingConfig);
    }
  };

  useLogin({
    onComplete(
      user,
      _isNewUser,
      _wasAlreadyAuthenticated,
      _loginMethod,
      _loginAccount,
    ) {
      if (user) {
        if (!hasExistingSolanaWallet(user)) {
          createWallet();
        }
        updatePortfolio(user);
        updateTransactionHistory(user);
        promptFundingIfNeeded(user);
      }
    },
    onError: (error) => {
      console.log("Error logging in: ", error);
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!ready || !authenticated) {
        setLoginTimeout(true);
      }
    }, 60000); // 1 minute timeout

    return () => clearTimeout(timer);
  }, [ready, authenticated]);

  const handleNavClick = (page: string) => {
    vibrate("light");
    updateActivePage(page);
  };

  const renderActivePage = () => {
    switch (activePage) {
      case "/home":
        return <Home />;
      case "/swap":
        return <Swap />;
      case "/history":
        return <History />;
      default:
        return <Home />;
    }
  };

  return (
    <div
      className={styles.mainContainer}
      style={{
        backgroundImage:
          activePage === "/home"
            ? `-webkit-linear-gradient(top, #2c1002 0%, #1f0b01 24%);`
            : ``,
      }}
    >
      {ready && authenticated ? (
        <div className={styles.mainAuthenticatedContainer}>
          <div className={styles.activePage}>{renderActivePage()}</div>
          {referralSession === "/swap" ? (
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
              </Nav>
            </Container>
          </Navbar>
          ) : (
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
                </Nav>
              </Container>
            </Navbar>
          )}
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
