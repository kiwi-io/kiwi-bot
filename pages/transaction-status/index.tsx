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
            <div className={styles.transactionStatusTypeContainer}>
                {`Transaction status: ${type}`}
            </div>
            <div className={styles.transactionSignatureContainer}>
                {
                    signature ?
                        <span>{signature}</span>
                    :
                        <span></span>
                }
            </div>
            <div className={styles.transactionErrorContainer}>
                {
                    error ?
                        <span>{error}</span>
                    :
                        <span></span>
                }
            </div>
            <div className={styles.closeButtonContainer}>

            </div>
        </div>
    )
}

export default TransactionStatus;