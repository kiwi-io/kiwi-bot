import React from "react";
import styles from "./history.module.css";
import StandardHeader from "../../components/StandardHeader";
import { useWalletContext } from "../../components/contexts";
import { TransactionHistory, TransferLog } from "../../utils";

const History = () => {

    const { txHistory } = useWalletContext();

    const mapTxHistoryToMessage = (history: TransactionHistory): string => {

        console.log("History: ", history);

        let message = "";

        if(!history.balanceChange || history.balanceChange.length === 0) {
            return;
        }

        let inflowLog: TransferLog;
        let outflowLog: TransferLog;

        if(history.balanceChange[0].amount < 0 && history.balanceChange[1].amount > 0) {
            outflowLog = history.balanceChange[0];
            inflowLog = history.balanceChange[1];
        }
        else if(history.balanceChange[0].amount > 0 && history.balanceChange[1].amount < 0) {
            inflowLog = history.balanceChange[0];
            outflowLog = history.balanceChange[1];
        }
        
        if(inflowLog) {
            message += `+${inflowLog.amount / (10 ** inflowLog.decimals)} ${inflowLog.symbol}`
        } 
        
        if(outflowLog) {
            message += `\t-${outflowLog.amount / (10 ** outflowLog.decimals)} ${outflowLog.symbol}`
        }

        return message;
    }

    return (
        <div className={styles.mainHistoryContainer}>
            <StandardHeader
                title={`History`}
                backButtonNavigateTo={"/home"}
                backButtonHide={true}
            />
            <div className={styles.txHistoryContainer}>
                {
                    txHistory.map((history) => {
                        return (
                            <div key={history.txHash} className={styles.txHistory}>
                                {
                                    <div className={styles.txTransferMessage}>{mapTxHistoryToMessage(history)}</div>
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default History;