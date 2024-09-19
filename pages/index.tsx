import React from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
import { useState } from "react";
import styles from "./index.module.css";

import Home from "./home";
import Apps from "./apps";
import Swap from "./swap";
import History from "./history";
import Rewards from "./rewards";

export default function Main() {
  const [activePage, setActivePage] = useState("/home");

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
      <div className={styles.activePage}>{renderActivePage()}</div>
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
  );
}
