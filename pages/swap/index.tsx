import React, { useEffect, useState } from "react";
import styles from "./swap.module.css";
import StandardHeader from "../../components/StandardHeader";
import { useTelegram } from "../../utils/twa";
import { delay } from "../../utils";
import { Form } from "react-bootstrap";

const Swap = () => {

  const [swapButtonText, setSwapButtonText] = useState<string>("Swap");
  const [isSwapExecuting, setIsSwapExecuting] = useState<boolean>(false);

  const [quantity, setQuantity] = useState<string>(``);
  const [isDecimalEntered, setIsDecimalEntered] = useState<boolean>(false);

  const handleKeypadInput = (value: any) => {
    // Prevent multiple decimals
    if (value === '.' && quantity.includes('.')) return;
    setQuantity((prev) => prev + value);
  };

  const handleBackspace = () => {
    vibrate("soft");
    setQuantity((prev) => prev.slice(0, -1));
  }
  

  const { vibrate } = useTelegram();

  const performSwapAction = async() => {
    vibrate("soft");
    setIsSwapExecuting((_) => true);
    await delay(3_000);
    setIsSwapExecuting((_) => false);
    vibrate("success");
  }

  useEffect(() => {
    const doStuff = () => {
      if(quantity.includes(".")) {
        setIsDecimalEntered((_) => true);
      }
      else {
        setIsDecimalEntered((_) => false);
      }
    }

    doStuff();
  }, [quantity]);

  return (
    <div className={styles.swapPageContainer}>
      <StandardHeader title={`Trade`} backButtonNavigateTo={"home"} backButtonHide={true}/>
      <div className={styles.swapComponentsContainer}>
        <div className={styles.swapFormContainer}>
          <div className={styles.swapOutTokenContainer}>
            <div className={styles.outTokenQuantityFormContainer}>
              <Form.Group>
                <Form.Control
                  className={styles.outTokenQuantityForm}
                  placeholder="0"
                  type="text"
                  value={quantity}
                  readOnly
                />
              </Form.Group>
            </div>
            <div className={styles.outTokenInfoContainer}>

            </div>
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
                    style = {{
                      opacity: value === "."  && isDecimalEntered ? 0.5 : 1.0 
                    }}
                    onClick = {
                      () => {
                        if(typeof value === `string`) {
                          handleKeypadInput(value);
                        }
                        else {
                          handleBackspace();
                        }
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
