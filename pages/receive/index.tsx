import React from "react";
import styles from "./receive.module.css";
import { useRouter } from "next/router";


const Receive = () => {

    const router = useRouter();

    const backButtonHandler = () => {
        router.push("/home");
    }

    return (
        <div className={styles.receivePageContainer}>
            <div className={styles.receiveHeaderContainer}>
                <div 
                    className={styles.backButtonContainer}
                    onClick={() => {
                        backButtonHandler();
                    }}
                >
                    <i className={`${styles.backButton} fa-solid fa-arrow-left`}></i>
                </div>
                <div className={styles.receiveTitleContainer}>
                    <span className={styles.receiveTitle}>Receive</span>
                </div>
                <div>
                    <span className={styles.dummyContainer}></span>
                </div>
            </div>
        </div>
    )
}

export default Receive;