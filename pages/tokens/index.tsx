import React from "react";
import styles from "./tokens.module.css";
import { useWalletContext } from "../../components/contexts";
import TokenDisplay from "../../components/TokenDisplay";
import { useRouter } from "next/router";
import { useTelegram } from "../../utils/twa";

const Tokens = () => {

    const {
        portfolio
    } = useWalletContext();

    const router = useRouter();
    const { vibrate } = useTelegram();

    const backButtonHandler = () => {
        router.push("/home");
    }
    
    return (
        portfolio && portfolio.items.length > 0 ?
            <div className={styles.tokensMainContainer}>
                <div className={styles.sendTokensHeaderContainer}>
                    <div 
                        className={styles.backButtonContainer}
                        onClick={() => {
                            vibrate("light");
                            backButtonHandler();
                        }}
                    >
                        <i className={`${styles.backButton} fa-solid fa-arrow-left`}></i>
                    </div>
                    <div className={styles.sendTitleContainer}>
                        <span className={styles.sendTitle}>Select Token</span>
                    </div>
                    <div>
                        <span className={styles.dummyContainer}>
                            <i className={`fa-solid fa-arrow-right`}></i>
                        </span>
                    </div>
                </div>
                <div className={styles.searchBarContainer}>
                    Search bar comes here
                </div>
                <div className={styles.allTokensContainer}>
                    {
                        portfolio.items.map((token, _) => {
                            return (
                            token.valueUsd >= 0 ?
                                <div className={styles.tokenDisplayContainer} key={token.address}>
                                <TokenDisplay tokenItem={token} showUsdValue={false} />
                                </div>
                            :
                                <></>
                            )
                        })
                    }
                </div>
            </div>
        :
            <div className={styles.tokensMainContainer}>
                No token balances found
            </div>
    )
}

export default Tokens;