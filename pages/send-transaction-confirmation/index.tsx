import React, { useEffect, useState } from "react";
import styles from "./send-transaction-confirmation.module.css";
import StandardHeader from "../../components/StandardHeader";
import { useRouter } from "next/router";
import { increaseDimensionsInUrl, trimAddress } from "../../utils";
import { useTelegram } from "../../utils/twa";
import Image from "next/image";
import { getTransferTransaction, TransferParams } from "../../utils/token/instructions";
import { Connection, PublicKey } from "@solana/web3.js";
import { useSolanaWallets } from "@privy-io/react-auth";
import { useTransferContext } from "../../components/contexts/TransferContext";

export interface SendTransactionConfirmationQueryParams {
    to?: string;
    token?: string;
    amount?: string;
}

const SendTransactionConfirmation = () => {
    const router = useRouter();
  const [isSending, setIsSending] = useState<boolean>(false);

  const { vibrate } = useTelegram();

  const { wallets } = useSolanaWallets();

  const { token, recipient, amount } = useTransferContext();

  useEffect(() => {
    if(!token || !recipient || !amount) {
      router.push("/home");
    }
  }, []);

  useEffect(() => {
    const doStuff = () => {
      if(!token) {
        router.push(`/tokens?navigateTo=send`)
      }
    };

    doStuff();
  }, [token]);

  const handleConfirmSend = async () => {
    if(wallets && wallets[0]) {
      setIsSending((_) => true);
      const connection = new Connection(process.env.NEXT_RPC_MAINNET_URL, "confirmed");

      const transferParams = {
        connection,
        fromPubkey: new PublicKey(wallets[0].address),
        toPubkey: new PublicKey(recipient),
        token: new PublicKey(token.address),
        tokenDecimals: token.decimals,
        amount: parseFloat(amount)
      } as TransferParams;

      if(parseFloat(amount) <= 0) {
        setIsSending((_) => false);
        router.push(`/transaction-status?type=error&error=Invalid amount`);
      }

      try {
        const transferTransaction = await getTransferTransaction(transferParams);

        let signature = "";

        // try once
        try {
          signature = await wallets[0].sendTransaction(transferTransaction, connection);
          console.log("unexpectedly didnt fail, sig: ", signature);
        }
        catch(err) {
          console.log("Error as expected: ", err);

          const signedTx = await wallets[0].signTransaction(transferTransaction);
          signature = await connection.sendTransaction(signedTx);
        }

        setIsSending((_) => false);
        router.push(`/transaction-status?type=success&signature=${signature}`);
      }
      catch(err) {
        setIsSending((_) => false);
        console.log("Error: ", err);

        //@ts-ignore
        if(err.includes("confirmed")) {
          router.push(`/transaction-status?type=unconfirmed`);
        }
        else {
          router.push(`/transaction-status?type=error&error=${err}`);
        }
      }
    }
  }

  return (
    <div className={styles.sendPageContainer}>
      <div className={styles.sendHeaderContainer}>
        <StandardHeader
          title={`Send ${token ? token.symbol : ""}`}
          backButtonNavigateTo={`/send`}
        />
      </div>
      <div className={styles.sendBodyContainer}>
        <div className={styles.tokenImageContainer}>
          {
            token ?
                <Image
                    src={increaseDimensionsInUrl(
                        token.logoURI,
                        60,
                        60,
                    )}
                    width={50}
                    height={50}
                    alt={`${token ? token.symbol : "Token"} img`}
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
                {wallets && wallets[0] ? trimAddress(wallets[0].address): ''}
            </div>
          </div>
          <div className={styles.keyValueContainer}>
            <div className={styles.keyContainer}>
                To
            </div>
            <div className={styles.valueContainer}>
                {recipient ? trimAddress(recipient) : ''}
            </div>
          </div>
          <div className={styles.keyValueContainer}>
            <div className={styles.keyContainer}>
                Token
            </div>
            <div className={styles.valueContainer}>
                {token ? trimAddress(token.address) : ``}
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