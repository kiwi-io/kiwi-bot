import React, { useEffect } from "react";
import styles from "./home.module.css";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import TokenDisplay from "../../components/TokenDisplay";
import { useWalletContext } from "../../components/contexts";
import { WALLET_UPDATE_FREQUENCY_IN_MS } from "../../constants";
import { formatWithCommas, TokenItem } from "../../utils";

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

  const DEFAULT_TOKENS_LIST: TokenItem[] = [
    {
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      decimals: 6,
      balance: 0.0,
      uiAmount: 0.0,
      chainId: "solana",
      name: "USDC",
      symbol: "USDC",
      logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
      priceUsd: 0.0,
      valueUsd: 0.0,
  } as TokenItem,
  {
      address: "",
      decimals: 9,
      balance: 0.0,
      uiAmount: 0.0,
      chainId: "solana",
      name: "Solana",
      symbol: "SOL",
      logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
      priceUsd: 0.0,
      valueUsd: 0.0,
  } as TokenItem,
  {
      address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
      decimals: 6,
      balance: 0.0,
      uiAmount: 0.0,
      chainId: "solana",
      name: "USDT",
      symbol: "USDT",
      logoURI: "https://raw.githubusercontent.com/Smaler1/coin/main/logo.png",
      priceUsd: 0.0,
      valueUsd: 0.0,
  } as TokenItem
  ];

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
                        <>
                          {
                            DEFAULT_TOKENS_LIST.map((token, _) => {
                              return (
                                <div className={styles.tokenDisplayContainer} key={token.address}>
                                  <TokenDisplay tokenItem={token} />
                                </div>
                              )
                            })
                          }
                        </>
                    }
                  </div>
                </div>
              :
              <div className={styles.tokensOuterContainer}>
                <div className={styles.tokensContainer}>
                  {
                    <>
                      {
                        DEFAULT_TOKENS_LIST.map((token, _) => {
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
                  }
                </div>
              </div>
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
