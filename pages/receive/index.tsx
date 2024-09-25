import React from "react";
import styles from "./receive.module.css";
import { useRouter } from "next/router";
import { useTelegram } from "../../utils/twa";
import QRCode from "../../components/QRCode";
import { usePrivy } from "@privy-io/react-auth";
import { trimAddress } from "../../utils";

const Receive = () => {

    const router = useRouter();
    const { vibrate } = useTelegram();

    const backButtonHandler = () => {
        router.push("/home");
    }

    const {
        user,
        ready,
        authenticated
    } = usePrivy();

    return (
        <div className={styles.receivePageContainer}>
            <div className={styles.receiveHeaderContainer}>
                <div 
                    className={styles.backButtonContainer}
                    onClick={() => {
                        vibrate("light");
                        backButtonHandler();
                    }}
                >
                    <i className={`${styles.backButton} fa-solid fa-arrow-left`}></i>
                </div>
                <div className={styles.receiveTitleContainer}>
                    <span className={styles.receiveTitle}>Receive</span>
                </div>
                <div>
                    <span className={styles.dummyContainer}>
                        <i className={`fa-solid fa-arrow-right`}></i>
                    </span>
                </div>
            </div>
            {
                user && ready && authenticated ?
                    <div className={styles.walletInfoContainer}>
                        <div className={styles.qrCodeContainer}>
                            <QRCode data={user.wallet.address}/>
                        </div>
                        <div className={styles.addressCopyContainer}>
                            <span className={styles.addressContainer}>{trimAddress(user.wallet.address)}</span>
                            <span
                                className={styles.copyAddressContainer}
                                onClick={() => {
                                    vibrate("soft");
                                }}
                            >Copy</span>
                        </div>
                        <div
                            className={styles.shareOnTelegramButtonContainer}
                            onClick={() => {
                                vibrate("light");
                                window.open(`https://t.me/share/url?url=https://t.me/samplekiwibot/${user.telegram.telegramUserId}`, '_blank');
                            }}
                        >
                            Share on Telegram
                        </div>
                    </div>
                :
                    <></>
            }
        </div>
    )
}

export default Receive;