import React from "react";
import styles from "./transaction-confirmation.module.css";
import StandardHeader from "../../components/StandardHeader";
import { useRouter } from "next/router";

export interface TransactionConfirmationQueryParams {
    title?: string;
    sourcePage?: string;
}

const TransactionConfirmation = () => {
    const router = useRouter();
  const { title, sourcePage }: TransactionConfirmationQueryParams = router.query;

    return (
        <div className={styles.transactionConfirmationContainer}>
            <div className={styles.transactionConfirmationHeaderContainer}>
                <StandardHeader
                title={`${title ? title: ''}`}
                backButtonNavigateTo={sourcePage ? sourcePage : "home"}
                />
            </div>
            <div className={styles.sendBodyContainer}>
            </div>            
        </div>
    )
}

export default TransactionConfirmation;