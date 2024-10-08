import React, { useEffect, useState } from "react";
import styles from "./transaction-confirmation.module.css";
import StandardHeader from "../../components/StandardHeader";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import { decodeTelegramCompatibleUrl, delay } from "../../utils";
import { useActionContext } from "../../components/contexts/ActionContext";
import Image from "next/image";
import { useTelegram } from "../../utils/twa";
import { useRouter } from "next/router";

export interface TransactionConfirmationParams {
    actionUrl?: string;
}

const TransactionConfirmation = () => {
    const router = useRouter();

    const { actionUrl, actionTarget, actionTargetLogo, updateActionUrl, updateActionTarget, updateActionTargetLogo } = useActionContext();
    const { user } = usePrivy();
    const [transaction, setTransaction] = useState<string>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { vibrate } = useTelegram();

    const performAction = async () => {
        const response = await axios.post(`${decodeTelegramCompatibleUrl(actionUrl)}?account=${user.wallet.address}`, {
            "account": user.wallet.address
        });
        const transaction = response.data.transaction;
        setTransaction((_) => transaction);
    }

    const handleApprove = async() => {
        setIsLoading((_) => true);
        await delay(3_000);
        setIsLoading((_) => false);
        vibrate("success");
        router.push(`/transaction-status?type=success&signature=px3jWwwuUt4DCoFo9rGYjcbQ79TT1gBAhafDZZ2gCmph2aBBwTRJ7r9vDLgXC3ZYmn2gJup3qpX4E89wGp8HMPg`);
    }

    const handleReject = async() => {
        vibrate("light");
        await delay(2_000);
        router.push(`/home`);
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
                <div className={styles.actionTargetMainContainer}>
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
                        <span className={styles.actionTargetContainer}>{actionTarget ? actionTarget : ``}</span>
                    </div>
                </div>
                
                <div className={styles.sendDetailsContainer}>
                    <div className={styles.keyValueContainer}
                    >
                        <div className={styles.keyContainer}>
                            WIF
                        </div>
                        <div
                            className={styles.valueContainer}
                            style={{
                                color: `#3de383`
                            }}
                        >
                            +5.78
                        </div>
                    </div>
                    <div className={styles.keyValueContainer}
                    >
                        <div className={styles.keyContainer}>
                            SOL
                        </div>
                        <div className={styles.valueContainer}
                            style = {{
                                color: `#e33d3d`
                            }}
                        >
                            -0.1
                        </div>
                    </div>
                </div>

                <div className={styles.networkFeeNoteContainer}>
                    <span>Network Fee: Sponsored</span>
                </div>
                
                <div className={styles.actionButtonsContainer}>
                    <div
                        className={styles.rejectButtonContainer}
                        onClick={() => {
                            handleReject();
                        }}
                    >
                        Reject
                    </div>
                    <div
                        className={styles.approveButtonContainer}
                        onClick={() => {
                            handleApprove();
                        }}
                    >
                        {
                            isLoading ?
                                <div className={styles.loadingContainer}>
                                    <div className={styles.loader}></div>
                                </div>
                            :
                                <div>Approve</div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransactionConfirmation;