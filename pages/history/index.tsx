import React from "react";
import styles from "./history.module.css";
import StandardHeader from "../../components/StandardHeader";

const History = () => {
    return (
        <div className={styles.mainHistoryContainer}>
            <StandardHeader
                title={`Previous transactions`}
                backButtonNavigateTo={"/home"}
                backButtonHide={true}
            />
            <div>Tx history comes here</div>
        </div>
    )
}

export default History;