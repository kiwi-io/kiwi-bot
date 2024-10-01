import React, { useEffect, useState } from "react";
import styles from "./send-transaction-confirmation.module.css";
import StandardHeader from "../../components/StandardHeader";
import { useRouter } from "next/router";
import { delay, increaseDimensionsInUrl, TokenItem, trimAddress } from "../../utils";
import { useTelegram } from "../../utils/twa";
import Image from "next/image";
import { useWalletContext } from "../../components/contexts";
import { getTransferTransaction, TransferParams } from "../../utils/token/instructions";
import { Connection, PublicKey } from "@solana/web3.js";
import { useSolanaWallets } from "@privy-io/react-auth";

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

  const [isSending, setIsSending] = useState<boolean>(false);

  const { vibrate } = useTelegram();
  const { portfolio } = useWalletContext();

  const { wallets } = useSolanaWallets();

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

  const handleConfirmSend = async () => {
    setIsSending((_) => true);
    const connection = new Connection(process.env.NEXT_RPC_MAINNET_URL);

    const transferParams = {
      connection,
      fromPubkey: new PublicKey(from),
      toPubkey: new PublicKey(to),
      token: new PublicKey(token),
      tokenDecimals: selectedTokenItem.decimals,
      amount: parseFloat(amount)
    } as TransferParams;

    const transferTransaction = await getTransferTransaction(transferParams);
    console.log("transfer transaction: ", transferTransaction);

    console.log(await wallets[0].sendTransaction!(transferTransaction, connection));

    await delay(3_000);
    setIsSending((_) => false);
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
                {selectedTokenItem ? trimAddress(selectedTokenItem.address) : ``}
            </div>
          </div>
          <div className={styles.keyValueContainer}>
            <div className={styles.keyContainer}>
                Amount
            </div>
            <div className={styles.valueContainer}>
                {(parseFloat(amount) / (selectedTokenItem ? 10**selectedTokenItem.decimals : 1)).toString()}
            </div>
          </div>
        </div>
        <div
          className={styles.sendExecuteContainer}
          onClick={() => {
            vibrate("light");
            handleConfirmSend();
          }}
        >
          {
            isSending
            ?
              <div className={styles.loader}></div>
            :
              <div>Confirm</div>
          }
        </div>
      </div>
    </div>
  );
}

export default SendTransactionConfirmation;