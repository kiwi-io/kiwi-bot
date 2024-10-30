import React, { useEffect, useState } from "react";
import styles from "./transaction-confirmation.module.css";
import StandardHeader from "../../components/StandardHeader";
import axios from "axios";
import { decodeTelegramCompatibleUrl, delay } from "../../utils";
import { useJupiterSwapContext } from "../../components/contexts/JupiterSwapContext";
import Image from "next/image";
import { useTelegram } from "../../utils/twa";
import { useRouter } from "next/router";
import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js";
import { SAMPLE_USER_PUBKEY } from "../../constants";

export interface TransactionConfirmationParams {
  actionUrl?: string;
}

const TransactionConfirmation = () => {
  const router = useRouter();

  const {
    side,
    tokenIn,
    tokenOut,
    tokenInData,
    tokenOutData,
    referrer,
    actionHost,
    actionHostLogo,
  } = useJupiterSwapContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { vibrate, closeApp } = useTelegram();

  // const performAction = async () => {
  //   try {
  //     if (!actionHost) {
  //       console.log("no action url found");
  //       return;
  //     }
  //     const response = await axios.post(
  //       `${decodeTelegramCompatibleUrl(actionUrl)}`,
  //       {
  //         account: SAMPLE_USER_PUBKEY.toString(),
  //       },
  //     );
  //     const transaction = response.data.transaction;
  //     const txBuffer = Buffer.from(transaction, "base64");

  //     // Deserialize the versioned transaction
  //     const deserializedTransaction =
  //       VersionedTransaction.deserialize(txBuffer);
  //     console.log("deserialized tx prepared");

  //     //@ts-ignore
  //     let privateKeyArray = JSON.parse(process.env.NEXT_PRIVATE_KEYPAIR);
  //     console.log("privatekey: ", privateKeyArray);

  //     let traderKeypair = Keypair.fromSecretKey(
  //       Uint8Array.from(privateKeyArray),
  //     );
  //     console.log("pubkey: ", traderKeypair.publicKey.toString());

  //     deserializedTransaction.sign([traderKeypair]);
  //     console.log("signed");

  //     const connection = new Connection(process.env.NEXT_RPC_MAINNET_URL);
  //     const signature = await connection.sendTransaction(
  //       deserializedTransaction,
  //       {
  //         skipPreflight: true,
  //         maxRetries: 1,
  //         preflightCommitment: "processed",
  //       },
  //     );

  //     console.log("signature: ", signature);
  //     router.push(`/transaction-status?type=success&signature=${signature}`);
  //   } catch (err) {
  //     console.log("Err: ", err);
  //     router.push(`/transaction-status?type=unconfirmed`);
  //   }
  // };

  const handleApprove = async () => {
    vibrate("heavy");
    setIsLoading((_) => true);
    // await performAction();
    await delay(2_000);
    setIsLoading((_) => false);
    router.push(
      `/transaction-status?type=success&signature=px3jWwwuUt4DCoFo9rGYjcbQ79TT1gBAhafDZZ2gCmph2aBBwTRJ7r9vDLgXC3ZYmn2gJup3qpX4E89wGp8HMPg`,
    );
  };

  const handleReject = async () => {
    vibrate("light");
    closeApp();
  };

  return (
    <div className={styles.mainTransactionConfirmationContainer}>
      <div className={styles.transactionConfirmationHeaderContainer}>
        <StandardHeader
          title={`${side === "buy" ? `Buy ${tokenInData ? tokenInData.symbol : ``}` : `Sell ${tokenOutData ? tokenOutData.symbol : ``}`}`}
          backButtonNavigateTo={"home"}
          backButtonHide={true}
        />
      </div>
      <div className={styles.transactionConfirmationBodyContainer}>
        <div className={styles.actionTargetMainContainer}>
          <div className={styles.actionTargetLogoContainer}>
            {
              <Image
                src={actionHostLogo}
                width={28}
                height={28}
                alt={`${actionHost ? actionHost : ``} img`}
                className={styles.actionTargetLogo}
              />
            }
            <span className={styles.actionTargetContainer}>
              {actionHost ? actionHost : ``}
            </span>
          </div>
        </div>

        <div className={styles.sendDetailsContainer}>
          <div className={styles.keyValueContainer}>
            <div className={styles.keyContainer}>
              <div className={styles.tokenDetailContainer}>
                <Image
                  src={`${tokenOutData ? tokenOutData.logoURI : ``}`}
                  width={25}
                  height={25}
                  alt={`${tokenOutData ? tokenOutData.symbol : ``} img`}
                  className={styles.actionTargetLogo}
                />
                <div className={styles.tokenDetailText}>
                  {tokenOutData ? tokenOutData.symbol : ``}
                </div>
              </div>
            </div>
            <div className={styles.valueContainer}>
              <div className={styles.tokenDetailContainer}>
                <Image
                  src={`${tokenInData ? tokenInData.logoURI : ``}`}
                  width={25}
                  height={25}
                  alt={`${tokenInData ? tokenInData.symbol : ``} img`}
                  className={styles.actionTargetLogo}
                />
                <div className={styles.tokenDetailText}>
                  {tokenInData ? tokenInData.symbol : ``}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actionButtonsContainer}>
          <div
            className={styles.approveButtonContainer}
            onClick={() => {
              handleApprove();
            }}
          >
            {isLoading ? (
              <div className={styles.loader}></div>
            ) : (
              <div>Approve</div>
            )}
          </div>
          <div
            className={styles.rejectButtonContainer}
            onClick={() => {
              handleReject();
            }}
          >
            Reject
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionConfirmation;
