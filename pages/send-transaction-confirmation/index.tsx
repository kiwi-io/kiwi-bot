import React, { useEffect, useState } from "react";
import styles from "./send-transaction-confirmation.module.css";
import StandardHeader from "../../components/StandardHeader";
import { useRouter } from "next/router";
import { increaseDimensionsInUrl, TokenItem, trimAddress } from "../../utils";
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
    const connection = new Connection(process.env.NEXT_RPC_MAINNET_URL, "processed");

    const transferParams = {
      connection,
      fromPubkey: new PublicKey(from),
      toPubkey: new PublicKey(to),
      token: new PublicKey(token),
      tokenDecimals: selectedTokenItem.decimals,
      amount: parseInt(amount)
    } as TransferParams;

    console.log("Starting the transfer flow: ", Date.now());

    try {
      const transferTransaction = await getTransferTransaction(transferParams);
      const sig = await wallets[0].sendTransaction!(transferTransaction, connection);

      console.log("Ending the transfer flow: ", Date.now());
      console.log("sig: ", sig);

      setIsSending((_) => false);
      router.push(`/transaction-status?type=success&signature=${sig}`);
    }
    catch(err) {
      setIsSending((_) => false);
      console.log("Error: ", err);
      router.push(`/transaction-status?type=error&error=${err}`);
    }
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