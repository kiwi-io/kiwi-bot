import React, { useEffect } from "react";
import styles from "./transaction-confirmation.module.css";
import StandardHeader from "../../components/StandardHeader";
import { useRouter } from "next/router";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";

export interface TransactionConfirmationParams {
    actionUrl?: string;
}

const TransactionConfirmation = () => {
    const router = useRouter();
    const { actionUrl }: TransactionConfirmationParams = router.query;

    const { user } = usePrivy();

    const performAction = async () => {
        const response = await axios.post(`${actionUrl}?account=${user.wallet.address}`, {
            "account": user.wallet.address
        });
        console.log("Response: ", response);
    }

    useEffect(() => {
        const doStuff = async() => {
            if(actionUrl) {
                console.log("Action url found: ", actionUrl);
                try {
                    await performAction();
                }
                catch(err) {
                    console.log("Error performing action: ", err);
                }
            }
            else {
                console.log("Action url not found");
            }
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