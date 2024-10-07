import React, { useEffect } from "react";
import styles from "./transaction-confirmation.module.css";
import StandardHeader from "../../components/StandardHeader";
import { simulateTransaction } from "../../utils";

const TransactionConfirmation = () => {

    useEffect(() => {
        const doStuff = async() => {
            await simulateTransaction();
        }

        doStuff();
    }, []);

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