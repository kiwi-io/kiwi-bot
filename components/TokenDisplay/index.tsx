import React from "react";
import styles from "./TokenDisplay.module.css";
import Image from "next/image";
import { formatWithCommas, increaseDimensionsInUrl, TokenItem } from "../../utils";
import { useTelegram } from "../../utils/twa";

export interface TokenDisplayProps {
    tokenItem: TokenItem
}

const TokenDisplay = ({
    tokenItem
}: TokenDisplayProps) => {    

    const { vibrate } = useTelegram(); 

    return (
        <div
            className={styles.mainContainer}
            onClick={() => {
                vibrate("light");
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
                        {
                            tokenItem.symbol === "SOL" ?
                                "Solana"
                            :
                                tokenItem.symbol === "USDC" ?
                                    "USDC"
                                :
                                    tokenItem.symbol === "USDT" ?
                                        "USDT"
                                    :
                                        tokenItem.name
                        }
                    </div>
                    <div className={styles.tokenHoldingContainer}>
                        {`${formatWithCommas(tokenItem.uiAmount.toFixed(2))} ${tokenItem.symbol}`}
                    </div>
                </div>
            </div>
            <div className={styles.tokenValueContainer}>
                {`$${tokenItem.valueUsd.toFixed(2)}`}
            </div>
        </div>
    )
}

export default TokenDisplay;