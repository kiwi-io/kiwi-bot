import React from "react";
import styles from "./TokenDisplay.module.css";
import Image from "next/image";
import { TokenItem } from "../../utils";

export interface TokenDisplayProps {
    tokenItem: TokenItem
}

const TokenDisplay = ({
    tokenItem
}: TokenDisplayProps) => {
    return (
        <div className={styles.mainContainer}>
            <div className={styles.tokenInfoContainer}>
                <div className={styles.tokenLogoContainer}>
                    {
                        <Image
                            src={tokenItem.logoURI}
                            width={40}
                            height={40}
                            alt={`${tokenItem.symbol} img`}
                            className={styles.tokenImage}
                        />
                    }
                </div>
                <div className={styles.tokenDataContainer}>
                    <div className={styles.tokenNameContainer}>
                        {tokenItem.name}
                    </div>
                    <div className={styles.tokenHoldingContainer}>
                        {`420 ${tokenItem.symbol}`}
                    </div>
                </div>
            </div>
            <div className={styles.tokenValueContainer}>
                {`$50,000`}
            </div>
        </div>
    )
}

export default TokenDisplay;