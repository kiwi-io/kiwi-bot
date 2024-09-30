import React from "react";
import styles from "./tokens.module.css";
import { useWalletContext } from "../../components/contexts";
import TokenDisplay from "../../components/TokenDisplay";
import { useRouter } from "next/router";
import { useTelegram } from "../../utils/twa";
import StandardHeader from "../../components/StandardHeader";

const Tokens = () => {

    const {
        portfolio
    } = useWalletContext();

    const router = useRouter();
    const { vibrate } = useTelegram();

    const navigateToSend = () => {
        router.push("/send");
    }
    
    return (
        <div className={styles.tokensMainContainer}>
            <StandardHeader title={"Select Token"} backButtonNavigateTo={"home"}/>
            {
                portfolio && portfolio.items.length > 0 ?
                    <div className={styles.allTokensOuterContainer}>
                        {
                            portfolio.items.map((token, _) => {
                                return (
                                token.valueUsd >= 0 ?
                                    <div
                                        className={styles.tokenDisplayContainer}
                                        key={token.address}
                                        onClick={() => {
                                            navigateToSend();
                                        }}
                                    >
                                    <TokenDisplay tokenItem={token} showUsdValue={false} />
                                    </div>
                                :
                                    <></>
                                )
                            })
                        }
                    </div>
                :
                    <div className={styles.tokensMainContainer}>
                        No token balances found
                    </div>
            }
        </div>
    )
}

export default Tokens;