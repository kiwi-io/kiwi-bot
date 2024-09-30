import React, { useEffect, useState } from "react";
import styles from "./send.module.css";
import { useRouter } from "next/router";
import StandardHeader from "../../components/StandardHeader";
import { TokenItem } from "../../utils";
import { useWalletContext } from "../../components/contexts";

export interface SendQueryParams {
    recipient?: string;
    token?: string;
    amount?: string;
}

const Send = () => {
    const [selectedTokenItem, setSelectedTokenItem] = useState<TokenItem>(undefined);

    const router = useRouter();
    
    const {
        recipient,
        token,
        amount
    }: SendQueryParams = router.query;

    const { portfolio } = useWalletContext();

    useEffect(() => {
        const doStuff = () => {
            if(portfolio && portfolio.items.length > 0) {
                const tokenItem = portfolio.items.filter(item => item.address === token)[0];

                setSelectedTokenItem((_) => tokenItem);
            }
        }

        doStuff();
    }, [token]);

    return (
        <div className={styles.receivePageContainer}>
            <div>
                <StandardHeader title={"Send"} backButtonNavigateTo={"tokens"}/>
            </div>
            <div>
                <span>{`Recipient: ${recipient}`}</span>
                <span>{`Token: ${selectedTokenItem.name}`}</span>
                <span>{`Amount: ${amount}`}</span>
            </div>
        </div>
    )
}

export default Send;