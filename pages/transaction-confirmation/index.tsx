import React from "react";
import styles from "./transaction-confirmation.module.css";
import StandardHeader from "../../components/StandardHeader";

const TransactionConfirmation = () => {

    return (
        <div className={styles.mainTransactionConfirmationContainer}>
            <div className={styles.transactionConfirmationHeaderContainer}>
                <StandardHeader
                title={`Confirm`}
                backButtonNavigateTo={"home"}
                />
            </div>
            <div className={styles.transactionConfirmationBodyContainer}>

            </div>
        </div>
    )
}

export default TransactionConfirmation;