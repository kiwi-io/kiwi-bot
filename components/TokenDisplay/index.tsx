import React from "react";
import styles from "./TokenDisplay.module.css";
import { TokenMetadata } from "../../utils/types";
import Image from "next/image";

export interface TokenDisplayProps {
    tokenMetadata: TokenMetadata
}

const TokenDisplay = ({
    tokenMetadata
}: TokenDisplayProps) => {
    return (
        <div className={styles.mainContainer}>
            <div className={styles.tokenInfoContainer}>
                <div className={styles.tokenLogoContainer}>
                    {
                        <Image
                            src={tokenMetadata.icon}
                            width={40}
                            height={40}
                            alt={`${tokenMetadata.ticker} img`}
                            className={styles.tokenImage}
                        />
                    }
                </div>
                <div className={styles.tokenDataContainer}>
                    <div className={styles.tokenNameContainer}>
                        {tokenMetadata.name}
                    </div>
                    <div className={styles.tokenHoldingContainer}>
                        {`420 ${tokenMetadata.ticker}`}
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