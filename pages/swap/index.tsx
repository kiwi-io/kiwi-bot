import React from "react";
import styles from "./swap.module.css";
import StandardHeader from "../../components/StandardHeader";

const Swap = () => {
  return (
    <div className={styles.swapPageContainer}>
      <StandardHeader title={`Trade`} backButtonNavigateTo={"home"} backButtonHide={true}/>
      <div className={styles.swapComponentsContainer}>
        <div className={styles.swapFormContainer}>
          
        </div>
        <div className={styles.swapInputContainer}>

        </div>
      </div>
    </div>
  )
}

export default Swap;
