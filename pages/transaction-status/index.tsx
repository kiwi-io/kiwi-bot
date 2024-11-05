import React, { useEffect } from "react";
import styles from "./transaction-status.module.css";
import { useRouter } from "next/router";
import { useTelegram } from "../../utils/twa";
import { useActivePageContext } from "../../components/contexts/ActivePageContext";

export type TransactionStatusType = "success" | "error" | "unconfirmed";

export interface TransactionStatusQueryParams {
  type?: TransactionStatusType;
  signature?: string;
  error?: string;
}

const TransactionStatus = () => {
  const router = useRouter();
  const { type, signature, error }: TransactionStatusQueryParams = router.query;

  const { vibrate, closeApp } = useTelegram();

  const { referralSession, updateActivePage } = useActivePageContext();

  const handleCloseButton = () => {
    vibrate("light");
    if (referralSession === "/swap") {
      closeApp();
    } else {
      updateActivePage("/home");
      router.push("/");
    }
  };

  useEffect(() => {
    if (type === "success") {
      vibrate("success");
    }
  }, [type]);

  return (
    <div className={styles.transactionStatusMainContainer}>
      <div className={styles.transactionStatusTypeImageContainer}>
        {type === "success" ? (
          <div className={styles.successImageContainer}>
            <i className="fa-solid fa-check"></i>
          </div>
        ) : type === "unconfirmed" ? (
          <div className={styles.unconfirmedImageContainer}>
            <i className="fa-solid fa-exclamation"></i>
          </div>
        ) : (
          <div className={styles.failureImageContainer}>
            <i className="fa-solid fa-x"></i>
          </div>
        )}
      </div>
      <div className={styles.transactionStatusLabelContainer}>
        {type === "success" ? (
          <div>Transaction confirmed</div>
        ) : type === "unconfirmed" ? (
          <div>Transaction unconfirmed</div>
        ) : (
          <div>Transaction failed</div>
        )}
      </div>
      <div className={styles.transactionSignatureViewContainer}>
        {type === "success" ? (
          signature ? (
            <a
              className={styles.explorerLink}
              href={`https://solscan.io/tx/${signature}`}
              target="_blank"
            >
              View on Explorer{" "}
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          ) : (
            <></>
          )
        ) : type === "unconfirmed" ? (
          <>Transaction could not be confirmed</>
        ) : type === "error" && error ? (
          <>Reason: {error}</>
        ) : (
          <></>
        )}
      </div>
      <div
        className={styles.closeButtonContainer}
        onClick={() => {
          handleCloseButton();
        }}
      >
        Close
      </div>
    </div>
  );
};

export default TransactionStatus;
