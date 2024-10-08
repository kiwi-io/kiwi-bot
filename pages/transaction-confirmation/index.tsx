import React, { useEffect, useState } from "react";
import styles from "./transaction-confirmation.module.css";
import StandardHeader from "../../components/StandardHeader";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import { decodeTelegramCompatibleUrl, increaseDimensionsInUrl } from "../../utils";
import { useActionContext } from "../../components/contexts/ActionContext";
import Image from "next/image";

export interface TransactionConfirmationParams {
    actionUrl?: string;
}

const TransactionConfirmation = () => {
    const { actionUrl, actionTarget, actionTargetLogo } = useActionContext();
    const { user } = usePrivy();
    const [transaction, setTransaction] = useState<string>(undefined);

    const performAction = async () => {
        const response = await axios.post(`${decodeTelegramCompatibleUrl(actionUrl)}?account=${user.wallet.address}`, {
            "account": user.wallet.address
        });
        const transaction = response.data.transaction;
        setTransaction((_) => transaction);
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
                backButtonHide={true}
                />
            </div>
            <div className={styles.transactionConfirmationBodyContainer}>
                <div className={styles.actionTargetLogoContainer}>
                    {
                        <Image
                        src={actionTargetLogo}
                        width={25}
                        height={25}
                        alt={`${actionTarget ? actionTarget : ``} img`}
                        className={styles.actionTargetLogo}
                        />
                    }
                </div>
                <div className={styles.actionTargetContainer}>
                    <span>{actionTarget ? actionTarget : ``}</span>
                    <span>{actionTargetLogo ? actionTargetLogo : ``}</span>
                </div>
            </div>
        </div>
    )
}

export default TransactionConfirmation;