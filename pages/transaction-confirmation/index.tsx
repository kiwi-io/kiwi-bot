import React, { useEffect } from "react";
import styles from "./transaction-confirmation.module.css";
import StandardHeader from "../../components/StandardHeader";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import { decodeTelegramCompatibleUrl } from "../../utils";
import { useActionContext } from "../../components/contexts/ActionContext";

export interface TransactionConfirmationParams {
    actionUrl?: string;
}

const TransactionConfirmation = () => {
    const { actionUrl } = useActionContext();
    const { user } = usePrivy();

    const performAction = async () => {
        const response = await axios.post(`${decodeTelegramCompatibleUrl(actionUrl)}?account=${user.wallet.address}`, {
            "account": user.wallet.address
        });
        console.log("Response: ", response);
    }

    useEffect(() => {
        const doStuff = async() => {
            if(actionUrl) {
                console.log("Action url found: ", decodeTelegramCompatibleUrl(actionUrl));
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
    }, [actionUrl]);

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