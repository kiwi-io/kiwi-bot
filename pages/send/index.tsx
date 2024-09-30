import React from "react";
import styles from "./send.module.css";
import { useRouter } from "next/router";

export interface SendQueryParams {
    recipient?: string;
    token?: string;
    amount?: string;
}

const Send = () => {
    const router = useRouter();
    
    const {
        recipient,
        token,
        amount
    }: SendQueryParams = router.query;


    return (
        <div className={styles.sendMainContainer}>
            <div>{`Token: ${token}`}</div>
            <div>{`Recipient: ${recipient}`}</div>
            <div>{`Amount: ${amount}`}</div>
        </div>
    );
}

export default Send;