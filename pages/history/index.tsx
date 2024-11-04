import React from "react";
import styles from "./history.module.css";
import StandardHeader from "../../components/StandardHeader";
import { useWalletContext } from "../../components/contexts";
import { increaseDimensionsInUrl, TransactionHistory, TransferLog } from "../../utils";
import Image from "next/image";


export interface TradingActivity {
    tokenLogo: string;
    token: string;
    tokenSymbol: string;
    amount: number,
    type: 'bought' | 'sold' | 'received'
}

const History = () => {

    const { txHistory } = useWalletContext();


    const mapTxHistoryToTradingActivity = (history: TransactionHistory): TradingActivity => {

        console.log("History: ", history);

        if(!history.balanceChange || history.balanceChange.length === 0) {
            return;
        }

        if(history.mainAction === "received") {
            if((history.balanceChange[0].amount / 10 ** history.balanceChange[0].decimals) >= 0.0000001) {
                return {
                    token: history.balanceChange[0].address ? history.balanceChange[0].address : '',
                    tokenLogo: history.balanceChange[0].logoURI ? history.balanceChange[0].logoURI : '',
                    tokenSymbol: history.balanceChange[0].symbol ? history.balanceChange[0].symbol : '',
                    amount: history.balanceChange[0].amount ? history.balanceChange[0].amount / 10 ** history.balanceChange[0].decimals : 0,
                    type: 'received',
                } as TradingActivity
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
            return {
                token: inflowLog.address,
                tokenLogo: inflowLog.logoURI,
                tokenSymbol: inflowLog.symbol,
                amount: inflowLog.amount / 10 ** inflowLog.decimals,
                type: 'bought',
            } as TradingActivity;
        }

        if(outflowLog && inflowLog && inflowLog.address === "So11111111111111111111111111111111111111112") {
            return {
                token: outflowLog.address,
                tokenLogo: outflowLog.logoURI,
                tokenSymbol: outflowLog.symbol,
                amount: outflowLog.amount / 10 ** outflowLog.decimals,
                type: 'sold',
            } as TradingActivity;
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
                    txHistory.length === 0 ?
                        <>No transaction history.</>
                    :
                        // <>
                        //     {
                        //         txHistory.map((history) => {

                        //             const parsedTradingActivity = mapTxHistoryToTradingActivity(history);
                        //             if(parsedTradingActivity) {
                        //                 console.log("parsedTradingActivity: ", parsedTradingActivity);
                                    
                        //                 let message = `${parsedTradingActivity.amount} ${parsedTradingActivity.tokenSymbol}`

                        //                 if(parsedTradingActivity.type === "received") {
                        //                     message = `Received ${message}`
                        //                 }
                        //                 else if(parsedTradingActivity.type === "bought") {
                        //                     message = `Bought ${message}`
                        //                 }
                        //                 else if(parsedTradingActivity.type === "sold") {
                        //                     message = `Sold ${message}`
                        //                 }

                        //                 return (
                        //                     <div key={history.txHash} className={styles.txHistory}>
                        //                         <Image
                        //                             src={increaseDimensionsInUrl(parsedTradingActivity.tokenLogo, 60, 60)}
                        //                             width={40}
                        //                             height={40}
                        //                             alt={`${parsedTradingActivity.tokenSymbol} img`}
                        //                             className={styles.tokenImage}
                        //                         />
                        //                         <div
                        //                             className={styles.txTransferMessage}
                        //                             style = {{
                        //                                 color: parsedTradingActivity.type === 'sold' ? `#e33d3d` : `#23b460`
                        //                             }}    
                        //                         >{message}</div>
                        //                     </div>
                        //                 )
                        //             }
                        //             else {
                        //                 return <></>
                        //             }
                        //         })
                        //     }
                        // </>
                        <>No transaction history.</>
                }
            </div>
        </div>
    )
}

export default History;