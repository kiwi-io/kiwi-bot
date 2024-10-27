import React, { useState } from "react";
import styles from "./swap.module.css";
import StandardHeader from "../../components/StandardHeader";
import { useTelegram } from "../../utils/twa";
import { delay } from "../../utils";

const Swap = () => {

  const [swapButtonText, setSwapButtonText] = useState<string>("Swap");
  const [isSwapExecuting, setIsSwapExecuting] = useState<boolean>(false);

  const { vibrate } = useTelegram();

  const performSwapAction = async() => {
    vibrate("soft");
    setIsSwapExecuting((_) => true);
    await delay(3_000);
    setIsSwapExecuting((_) => false);
    vibrate("success");
  }

  return (
    <div className={styles.swapPageContainer}>
      <StandardHeader title={`Trade`} backButtonNavigateTo={"home"} backButtonHide={true}/>
      <div className={styles.swapComponentsContainer}>
        <div className={styles.swapFormContainer}>
          <div className={styles.swapOutTokenContainer}>
          </div>
          <div className={styles.swapIconContainer}> 
            <i className="fa-solid fa-arrow-down"></i>
          </div>
          <div className={styles.swapInTokenContainer}>
          </div>
        </div>
        <div className={styles.swapInputContainer}>
          <div className={styles.numKeypadContainer}>
            {
              [`7`, `8`, `9`, `4`, `5`, `6`, "1", `2`, `3`, `.`, `0`, <i className="fa-solid fa-arrow-left"></i>].map((value, index) => {
                return (
                  <div
                    key={index}
                    className={styles.numKeyContainer}
                    onClick = {
                      () => {
                        vibrate("soft");
                      }
                    }
                  >
                    {value}
                  </div>
                )
              })
            }
          </div>
          <div
            className={styles.swapButtonContainer}
            onClick = {
              () => {
                performSwapAction();
              }
            }
          >
            {isSwapExecuting ? (
              <div className={styles.loader}></div>
            ) : (
              <div>{swapButtonText}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Swap;
