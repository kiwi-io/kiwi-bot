import React, { useEffect, useState } from "react";
import styles from "./transaction-confirmation.module.css";
import StandardHeader from "../../components/StandardHeader";
import axios from "axios";
import { decodeTelegramCompatibleUrl, delay } from "../../utils";
import { useActionContext } from "../../components/contexts/ActionContext";
import Image from "next/image";
import { useTelegram } from "../../utils/twa";
import { useRouter } from "next/router";
import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js";
import { SAMPLE_USER_PUBKEY } from "../../constants";

export interface TransactionConfirmationParams {
    actionUrl?: string;
}

const TransactionConfirmation = () => {
    const router = useRouter();

    const { actionUrl, actionTarget, actionTargetLogo, note } = useActionContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { vibrate, closeApp } = useTelegram();

    const performAction = async () => {
        try {
            if(!actionUrl) {
                console.log("no action url found");
                return;
            }
            const response = await axios.post(`${decodeTelegramCompatibleUrl(actionUrl)}`, {
                "account": SAMPLE_USER_PUBKEY.toString()
            });
            const transaction = response.data.transaction;
            const txBuffer = Buffer.from(transaction, 'base64');

            // Deserialize the versioned transaction
            const deserializedTransaction = VersionedTransaction.deserialize(txBuffer);
            console.log("deserialized tx prepared");
    
            //@ts-ignore
            let privateKeyArray = JSON.parse(process.env.NEXT_PRIVATE_KEYPAIR);
            console.log("privatekey: ", privateKeyArray);
    
            let traderKeypair = Keypair.fromSecretKey(
                Uint8Array.from(privateKeyArray)
            );
            console.log("pubkey: ", traderKeypair.publicKey.toString());

            deserializedTransaction.sign([traderKeypair]);
            console.log("signed");
    
            const connection = new Connection(process.env.NEXT_RPC_MAINNET_URL);
            const signature = await connection.sendTransaction(deserializedTransaction, {
                skipPreflight: true,
                maxRetries: 1,
                preflightCommitment: 'processed'
            });

            console.log("signature: ", signature);
            router.push(`/transaction-status?type=success&signature=${signature}`);
        }
        catch(err) {
            console.log("Err: ", err);
            router.push(`/transaction-status?type=unconfirmed`);
        }
    }

    const handleApprove = async() => {
        vibrate("heavy");
        setIsLoading((_) => true);
        await performAction();
        setIsLoading((_) => false);
        router.push(`/transaction-status?type=success&signature=px3jWwwuUt4DCoFo9rGYjcbQ79TT1gBAhafDZZ2gCmph2aBBwTRJ7r9vDLgXC3ZYmn2gJup3qpX4E89wGp8HMPg`);
    }

    const handleReject = async() => {
        vibrate("light");
        closeApp();
    }

    useEffect(() => {
        const doStuff = async() => {
            if(actionUrl) {
                console.log("Action url found: ", decodeTelegramCompatibleUrl(actionUrl));
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
                            width={28}
                            height={28}
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
                            <div className={styles.tokenDetailContainer}>
                                <Image
                                    src={`https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png`}
                                    width={25}
                                    height={25}
                                    alt={`SOL img`}
                                    className={styles.actionTargetLogo}
                                />
                                <div className={styles.tokenDetailText}>SOL</div>
                            </div>
                        </div>
                        <div className={styles.valueContainer}
                            style = {{
                                color: `#e33d3d`
                            }}
                        >
                            -{decodeTelegramCompatibleUrl(note)}
                        </div>
                    </div>
                </div>

                <div className={styles.networkFeeNoteContainer}>
                    <span>Network Fee: Free</span>
                </div>
                
                <div className={styles.actionButtonsContainer}>
                    <div
                        className={styles.approveButtonContainer}
                        onClick={() => {
                            handleApprove();
                        }}
                    >
                        {
                            isLoading ?
                                <div className={styles.loader}></div>
                            :
                                <div>Approve</div>
                        }
                    </div>
                    <div
                        className={styles.rejectButtonContainer}
                        onClick={() => {
                            handleReject();
                        }}
                    >
                        Reject
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default TransactionConfirmation;