import React from "react";
import styles from "./TokenDisplay.module.css";
import Image from "next/image";
import {
  formatWithCommas,
  increaseDimensionsInUrl,
  TokenItem,
} from "../../utils";
import { useTelegram } from "../../utils/twa";
import { useJupiterSwapContext } from "../contexts/JupiterSwapContext";
import { useActivePageContext } from "../contexts/ActivePageContext";
import { WRAPPED_SOL_MAINNET } from "../../constants";

export interface TokenDisplayProps {
  tokenItem: TokenItem;
  showUsdValue: boolean;
}

const TokenDisplay = ({ tokenItem, showUsdValue }: TokenDisplayProps) => {
  const { vibrate } = useTelegram();

  const {
    updateTokenIn,
    updateTokenOut,
    updateTokenOutData,
    updateTokenInData,
  } = useJupiterSwapContext();

  const { updateActivePage } = useActivePageContext();

  const handleClick = () => {
    if (
      tokenItem.address === WRAPPED_SOL_MAINNET ||
      tokenItem.address === `So11111111111111111111111111111111111111111`
    ) {
      return;
    }

    vibrate("light");
    updateTokenOut(tokenItem.address);
    updateTokenOutData(tokenItem.address);
    updateTokenIn(WRAPPED_SOL_MAINNET);
    updateTokenInData(WRAPPED_SOL_MAINNET);
    updateActivePage("/swap");
  };

  return (
    <div
      className={styles.mainContainer}
      onClick={() => {
        handleClick();
      }}
    >
      <div className={styles.tokenInfoContainer}>
        <div className={styles.tokenLogoContainer}>
          {
            <Image
              src={increaseDimensionsInUrl(tokenItem.logoURI, 60, 60)}
              width={50}
              height={50}
              alt={`${tokenItem.symbol} img`}
              className={styles.tokenImage}
            />
          }
        </div>
        <div className={styles.tokenDataContainer}>
          <div className={styles.tokenNameContainer}>
            {tokenItem.symbol === "SOL"
              ? "Solana"
              : tokenItem.symbol === "USDC"
                ? "USDC"
                : tokenItem.symbol === "USDT"
                  ? "USDT"
                  : tokenItem.name}
          </div>
          <div className={styles.tokenHoldingContainer}>
            {`${formatWithCommas(tokenItem.uiAmount.toFixed(2))} ${tokenItem.symbol}`}
          </div>
        </div>
      </div>
      <div className={styles.tokenValueContainer}>
        {showUsdValue ? <>{`$${tokenItem.valueUsd.toFixed(2)}`}</> : <></>}
      </div>
    </div>
  );
};

export default TokenDisplay;
