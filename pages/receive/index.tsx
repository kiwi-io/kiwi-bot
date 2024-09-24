import React from "react";
import styles from "./receive.module.css";
import { useRouter } from "next/router";
import { useTelegram } from "../../utils/twa";
import QRCode from "../../components/QRCode";

const Receive = () => {

    const router = useRouter();
    const { vibrate } = useTelegram();

    const backButtonHandler = () => {
        router.push("/home");
    }

    return (
        <div className={styles.receivePageContainer}>
            <div className={styles.receiveHeaderContainer}>
                <div 
                    className={styles.backButtonContainer}
                    onClick={() => {
                        vibrate("soft");
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
            <div className={styles.qrCodeContainer}>
                    <QRCode data={"4RetBVitL3h4V1YrGCJMhGbMNHRkhgnDCLuRjj8a9i1P"}/>
            </div>
        </div>
    )
}

export default Receive;