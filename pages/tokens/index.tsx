import React, { useEffect } from "react";
import styles from "./tokens.module.css";
import { useWalletContext } from "../../components/contexts";
import TokenDisplay from "../../components/TokenDisplay";
import { useRouter } from "next/router";
import { useTelegram } from "../../utils/twa";
import StandardHeader from "../../components/StandardHeader";
import { TokenItem } from "../../utils";
import { useTransferContext } from "../../components/contexts/TransferContext";

const Tokens = () => {
  const router = useRouter();
  const { navigateTo } = router.query;

  const { portfolio } = useWalletContext();

  const { vibrate } = useTelegram();

  const { updateToken } = useTransferContext();

  const navigateToSend = (selectedTokenItem: TokenItem) => {
    vibrate("light");
    updateToken(selectedTokenItem);
    router.push(`/send`);
  };

  const navigateToReceive = (selectedTokenItem: TokenItem) => {
    vibrate("light");
    updateToken(selectedTokenItem);
    router.push(`/receive`);
  };

  return (
    <div className={styles.tokensMainContainer}>
      <StandardHeader title={"Select Token"} backButtonNavigateTo={"home"} />
      {portfolio && portfolio.items.length > 0 ? (
        <div className={styles.allTokensOuterContainer}>
          {portfolio.items.map((token, _) => {
            return token.valueUsd >= 0 ? (
              <div
                className={styles.tokenDisplayContainer}
                key={token.address}
                onClick={() => {
                  if (navigateTo === "send") {
                    navigateToSend(token);
                  } else if (navigateTo === "receive") {
                    navigateToReceive(token);
                  }
                }}
              >
                <TokenDisplay tokenItem={token} showUsdValue={false} />
              </div>
            ) : (
              <></>
            );
          })}
        </div>
      ) : (
        <div className={styles.tokensMainContainer}>
          No token balances found
        </div>
      )}
    </div>
  );
};

export default Tokens;
