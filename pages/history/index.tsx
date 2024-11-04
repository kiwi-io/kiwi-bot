import React from "react";
import styles from "./history.module.css";
import StandardHeader from "../../components/StandardHeader";
import { useWalletContext } from "../../components/contexts";
import { TransactionHistory, TransferLog } from "../../utils";

const History = () => {

    const { txHistory } = useWalletContext();

    const mapTxHistoryToMessage = (history: TransactionHistory): string => {

        console.log("History: ", history);

        if(!history.balanceChange || history.balanceChange.length === 0) {
            return;
        }

        if(history.mainAction === "received") {
            if((history.balanceChange[0].amount / 10 ** history.balanceChange[0].decimals) >= 0.0001) {
                return `Received ${(history.balanceChange[0].amount / (10 ** history.balanceChange[0].decimals)).toFixed(3)} ${history.balanceChange[0].symbol}`;
            }
        }

        let inflowLog: TransferLog;
        let outflowLog: TransferLog;

        if(history.balanceChange[0] && history.balanceChange[0].amount < 0) {
            outflowLog = history.balanceChange[0];
        }
        else if(history.balanceChange[0] && history.balanceChange[0].amount > 0) {
            inflowLog = history.balanceChange[0];
        }

        if(history.balanceChange[1] && history.balanceChange[1].amount > 0) {
            inflowLog = history.balanceChange[1];
        }
        else if(history.balanceChange[1] && history.balanceChange[1].amount < 0) {
            outflowLog = history.balanceChange[1];
        }
        
        if(inflowLog && outflowLog && outflowLog.address === "So11111111111111111111111111111111111111112") {
            return `+${(inflowLog.amount / 10 ** inflowLog.decimals).toFixed(3)} ${inflowLog.symbol}`
        }

        if(outflowLog && inflowLog && inflowLog.address === "So11111111111111111111111111111111111111112") {
            return `${(outflowLog.amount / 10 ** outflowLog.decimals).toFixed(3)} ${outflowLog.symbol}`
        }
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