import React, { useEffect } from "react";
import styles from "./home.module.css";
import { usePrivy, useSolanaWallets } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import TokenDisplay from "../../components/TokenDisplay";
import { useWalletContext } from "../../components/contexts";
import {
  formatWithCommas,
} from "../../utils";
import { useTelegram } from "../../utils/twa";
import { DEFAULT_TOKENS_LIST, WRAPPED_SOL_MAINNET } from "../../constants";
import { useJupiterSwapContext } from "../../components/contexts/JupiterSwapContext";
import { useActivePageContext } from "../../components/contexts/ActivePageContext";
import { BN } from "@coral-xyz/anchor";
import { createBuyTokenInstruction } from "../../utils/daosdotfun/instructions";
import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { getDAOSTransaction } from "../../utils/daosdotfun/utils";

const Home = () => {
  const router = useRouter();

  const { user, ready, authenticated } = usePrivy();

  const { portfolio } =
    useWalletContext();
  const { updateReferralSession, updateActivePage } = useActivePageContext();

  const {
    updateSide,
    updateTokenIn,
    updateTokenInData,
    updateTokenOut,
    updateTokenOutData,
    updateReferrer,
    updateActionHost,
    updateActionHostLogo,
  } = useJupiterSwapContext();

  const { wallets } = useSolanaWallets();
  
  useEffect(() => {
    const doStuff = async() => {
      if(user && wallets && wallets.length > 0) {
        const wallet = new PublicKey(user.wallet.address);
        // const wallet = new PublicKey("4RetBVitL3h4V1YrGCJMhGbMNHRkhgnDCLuRjj8a9i1P");
        const tokenMint = new PublicKey("HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC");
        const signerTokenAta = await getAssociatedTokenAddress(tokenMint, wallet, false, TOKEN_2022_PROGRAM_ID);
        const signerFundingAta = await getAssociatedTokenAddress(new PublicKey(WRAPPED_SOL_MAINNET), wallet);
        const ix = await createBuyTokenInstruction(
          {
            signer: wallet,
            tokenMint,
            signerTokenAta,
            signerFundingAta,
          },
          new BN(1),
          new BN(1)
        );

        const vTx = await getDAOSTransaction(ix, wallet, tokenMint, signerTokenAta, signerFundingAta, 1);

        let signature = "";
        
        try {
          const connection = new Connection(process.env.NEXT_RPC_MAINNET_URL);

          const signedTx = await wallets[0].signTransaction(vTx);
    
          signature = await connection.sendTransaction(signedTx, {
            skipPreflight: false,
            preflightCommitment: "processed",
            maxRetries: 3,
          });
          console.log("signature: ", signature);
        } catch (err) {
          console.log("Error submitting tx: ", err);    
        }
      }
    }

    doStuff();
  }, [wallets, user]);

  useEffect(() => {
    if (!user) {
      router.push("/");
    }

    //@ts-ignore
    const startParam = window.Telegram.WebApp.initDataUnsafe.start_param;
    if (startParam && user) {
      if (startParam.startsWith("buy")) {
        updateSide("buy");
        const components = startParam.split("-");

        const token = components[1];
        const referrer = components[2];

        updateTokenIn(token);
        updateTokenInData(token);

        updateTokenOut(WRAPPED_SOL_MAINNET);
        updateTokenOutData(WRAPPED_SOL_MAINNET);

        updateReferrer(referrer);
        updateActionHost("https://jup.ag/swap");
        updateActionHostLogo("/logos/jupiter_logo.svg");
        updateActivePage("/swap");
        updateReferralSession("/swap");
      } else if (startParam.startsWith("sell")) {
        updateSide("sell");
        const components = startParam.split("-");

        const token = components[1];
        const referrer = components[2];

        updateTokenIn(WRAPPED_SOL_MAINNET);
        updateTokenInData(WRAPPED_SOL_MAINNET);

        updateTokenOut(token);
        updateTokenOutData(token);

        updateReferrer(referrer);
        updateActionHost("https://jup.ag/swap");
        updateActionHostLogo("/logos/jupiter_logo.svg");
        updateActivePage("/swap");
        updateReferralSession("/swap");
      }
    }
  }, []);

  const navigateToAllTokens = (target: string) => {
    if (user && ready && authenticated) {
      router.push(`/tokens?navigateTo=${target}`);
    }
  };

  const navigateToReceive = () => {
    if (user && ready && authenticated) {
      router.push(`/receive`);
    }
  };

  const { vibrate } = useTelegram();

  return (
    <div className={styles.container}>
      {ready && authenticated && user ? (
        <div className={styles.mainContainer}>
          <div className={styles.headerAndOverviewContainer}>
            <div className={styles.headerContainer}>
              <div className={styles.usernameContainer}>
                <div>{`${user.telegram?.username ? user.telegram?.username : user.telegram.firstName}`}</div>
              </div>
              <div
                className={styles.settingsContainer}
                onClick={() => {
                  // navigateToSettings();
                }}
              >
                <div>{/* <i className="fa-solid fa-gear"></i> */}</div>
              </div>
            </div>
            <div className={styles.overviewContainer}>
              <div className={styles.balanceContainer}>
                <div className={styles.balanceValue}>
                  <span className={styles.dollarSign}>{`$ `}</span>
                  <span className={styles.balance}>
                    {formatWithCommas(portfolio.totalUsd.toFixed(2))}
                  </span>
                </div>
              </div>
              <div className={styles.actionButtonsContainer}>
                <div className={styles.receiveButtonContainer}>
                  <button
                    className={`${styles.actionButton} ${styles.receiveButton}`}
                    onClick={() => {
                      vibrate("medium");
                      navigateToReceive();
                    }}
                  >
                    <span
                      className={`${styles.actionButtonIcon} ${styles.receiveButtonIcon} fa-solid fa-download`}
                    ></span>
                    <span>Deposit</span>
                  </button>
                </div>
                <div className={styles.sendButtonContainer}>
                  <button
                    className={`${styles.actionButton} ${styles.sendButton}`}
                    onClick={() => {
                      vibrate("heavy");
                      navigateToAllTokens("send");
                    }}
                  >
                    <span
                      className={`${styles.actionButtonIcon} ${styles.sendButtonIcon} fa-solid fa-upload`}
                    ></span>
                    <span>Withdraw</span>
                  </button>
                </div>
                {/* <div className={styles.copyButtonContainer}>
                  <button
                    className={`${styles.actionButton} ${styles.copyButton}`}
                    onClick={() => {
                      vibrate("soft");
                      copyToClipboard(user.wallet.address);
                    }}
                  >
                    <span
                      className={`${styles.actionButtonIcon} ${styles.copyButtonIcon} fa-solid fa-copy`}
                    ></span>
                    <span>Copy</span>
                  </button>
                </div> */}
              </div>
            </div>
          </div>
          {portfolio ? (
            <div className={styles.tokensOuterContainer}>
              <div className={styles.tokensContainer}>
                {portfolio.items.length > 0 ? (
                  <>
                    {portfolio.items.map((token, _) => {
                      return token.valueUsd >= 0 ? (
                        <div
                          className={styles.tokenDisplayContainer}
                          key={token.address}
                        >
                          <TokenDisplay tokenItem={token} showUsdValue={true} />
                        </div>
                      ) : (
                        <></>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {DEFAULT_TOKENS_LIST.map((token, _) => {
                      return (
                        <div
                          className={styles.tokenDisplayContainer}
                          key={token.address}
                        >
                          <TokenDisplay tokenItem={token} showUsdValue={true} />
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.tokensOuterContainer}>
              <div className={styles.tokensContainer}>
                {
                  <>
                    {DEFAULT_TOKENS_LIST.map((token, _) => {
                      return (
                        <div
                          className={styles.tokenDisplayContainer}
                          key={token.address}
                        >
                          <TokenDisplay tokenItem={token} showUsdValue={true} />
                        </div>
                      );
                    })}
                  </>
                }
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p>User not logged in</p>
        </div>
      )}
    </div>
  );
};

export default Home;
