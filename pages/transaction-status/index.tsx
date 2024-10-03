import React from "react";
import styles from "./transaction-status.module.css";
import { useRouter } from "next/router";

export type TransactionStatusType = "success" | "error";

export interface TransactionStatusQueryParams {
    type?: TransactionStatusType;
    signature?: string;
    error?: string;
}

const TransactionStatus = () => {
    const router = useRouter();
    const { type, signature, error }: TransactionStatusQueryParams = router.query;

    return (
        <div className={styles.transactionStatusMainContainer}>
            <div className={styles.transactionStatusTypeImageContainer}>
                {
                    type === "success" ?
                        <div className={styles.successImageContainer}><i className="fa-solid fa-check"></i></div>
                    :
                        <div className={styles.failureImageContainer}><i className="fa-solid fa-x"></i></div>
                }
            </div>
            <div className={styles.transactionStatusLabelContainer}>
                {
                    type === "success" ?
                        <>Transaction confirmed</>
                    :
                        <>Transaction failed</>
                }
            </div>
            <div className={styles.transactionSignatureViewContainer}>
                {
                    type === "success" ?
                        signature ?
                            <a href={`https://solscan.io/tx/${signature}`}>View on Explorer <i className="fa-solid fa-arrow-up-right-from-square"></i></a>
                        :
                            <></>
                    :
                        type === "error" && error ?
                            <>Reason: {error}</>
                        :
                            <></>
                }
            </div>
            <div className={styles.closeButtonContainer}>
                Close
            </div>
        </div>
    )
}

export default TransactionStatus;