import React, { useEffect, useState } from "react";
import styles from "./send-transaction-confirmation.module.css";
import StandardHeader from "../../components/StandardHeader";
import { useRouter } from "next/router";
import { increaseDimensionsInUrl, TokenItem, trimAddress } from "../../utils";
import { useTelegram } from "../../utils/twa";
import Image from "next/image";
import { useWalletContext } from "../../components/contexts";

export interface SendTransactionConfirmationQueryParams {
    from?: string;
    to?: string;
    token?: string;
    amount?: string;
}

const SendTransactionConfirmation = () => {
    const router = useRouter();
  const { from, to, token, amount }: SendTransactionConfirmationQueryParams = router.query;

  const [selectedTokenItem, setSelectedTokenItem] =
    useState<TokenItem>(undefined);

  const { vibrate } = useTelegram();
  const { portfolio } = useWalletContext();

  useEffect(() => {
    const doStuff = () => {
      if (portfolio && portfolio.items.length > 0) {
        const tokenItem = portfolio.items.filter(
          (item) => item.address === token,
        )[0];

        setSelectedTokenItem((_) => tokenItem);
      }
    };

    doStuff();
    console.log("selectedTokenItem: ", selectedTokenItem);
  }, [token]);

  const confirmSendHandler = async () => {
    console.log(`Sending ${amount} ${selectedTokenItem ? selectedTokenItem.symbol : ``} from ${from} to ${to}`)
  }

  return (
    <div className={styles.sendPageContainer}>
      <div className={styles.sendHeaderContainer}>
        <StandardHeader
          title={`Send ${selectedTokenItem ? selectedTokenItem.symbol : ""}`}
          backButtonNavigateTo={"tokens"}
        />
      </div>
      <div className={styles.sendBodyContainer}>
        <div className={styles.tokenImageContainer}>
          {
            selectedTokenItem ?
                <Image
                    src={increaseDimensionsInUrl(
                        selectedTokenItem.logoURI,
                        60,
                        60,
                    )}
                    width={50}
                    height={50}
                    alt={`${selectedTokenItem ? selectedTokenItem.symbol : "Token"} img`}
                    className={styles.tokenImage}
                />
            :
                <></>
          }
        </div>
        <div className={styles.sendDetailsContainer}>
          <div className={styles.keyValueContainer}>
            <div className={styles.keyContainer}>
                From
            </div>
            <div className={styles.valueContainer}>
                {from ? trimAddress(from): ''}
            </div>
          </div>
          <div className={styles.keyValueContainer}>
            <div className={styles.keyContainer}>
                To
            </div>
            <div className={styles.valueContainer}>
                {to ? trimAddress(to) : ''}
            </div>
          </div>
          <div className={styles.keyValueContainer}>
            <div className={styles.keyContainer}>
                Token
            </div>
            <div className={styles.valueContainer}>
                {selectedTokenItem ? selectedTokenItem.symbol : ``}
            </div>
          </div>
          <div className={styles.keyValueContainer}>
            <div className={styles.keyContainer}>
                Amount
            </div>
            <div className={styles.valueContainer}>
                {amount}
            </div>
          </div>
        </div>
        <div
          className={styles.sendExecuteContainer}
          onClick={() => {
            vibrate("light");
            confirmSendHandler();
          }}
        >
          Confirm
        </div>
      </div>
    </div>
  );
}

export default SendTransactionConfirmation;