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
          <div className={styles.numKeypadContainer}>
            {
              [`7`, `8`, `9`, `4`, `5`, `6`, "1", `2`, `3`, `.`, `0`, <i className="fa-solid fa-arrow-left"></i>].map((value, index) => {
                return (
                  <div key={index} className={styles.numKeyContainer}>
                    {value}
                  </div>
                )
              })
            }
          </div>
          <div className={styles.swapButtonContainer}>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Swap;
