import React, { useEffect, useRef, useState } from "react";
import styles from "./swap.module.css";
import StandardHeader from "../../components/StandardHeader";
import { useTelegram } from "../../utils/twa";
import { delay, getToken, TokenData } from "../../utils";
import { Form } from "react-bootstrap";
import { useJupiterSwapContext } from "../../components/contexts/JupiterSwapContext";
import Image from "next/image";

const Swap = () => {

  const [swapButtonText, setSwapButtonText] = useState<string>("Swap");
  const [isSwapExecuting, setIsSwapExecuting] = useState<boolean>(false);

  const [outQuantity, setOutQuantity] = useState<string>(``);
  const inputFieldRef = useRef(null);

  const [isDecimalEntered, setIsDecimalEntered] = useState<boolean>(false);

  const [tokenInData, setTokenInData] = useState<TokenData>();
  const [tokenOutData, setTokenOutData] = useState<TokenData>(); 

  const handleKeypadInput = (value: any) => {
    vibrate("soft");
    // Prevent multiple decimals
    if (value === '.' && outQuantity.includes('.')) return;
    setOutQuantity((prev) => prev + value);
  };

  const handleBackspace = () => {
    vibrate("soft");
    setOutQuantity((prev) => prev.slice(0, -1));
  }

  const { vibrate } = useTelegram();

  const { tokenIn, tokenOut } = useJupiterSwapContext();

  const performSwapAction = async() => {
    vibrate("soft");
    setIsSwapExecuting((_) => true);
    await delay(3_000);
    setIsSwapExecuting((_) => false);
    vibrate("success");
  }

  useEffect(() => {
    if (inputFieldRef.current) {
      inputFieldRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const doStuff = () => {
      if(outQuantity.includes(".")) {
        setIsDecimalEntered((_) => true);
      }
      else {
        setIsDecimalEntered((_) => false);
      }
    }

    doStuff();
  }, [outQuantity]);

  useEffect(() => {
    const doStuff = async () => {
      const tokenDataRes = await getToken(tokenIn);
      console.log("tokenIn address: ", tokenDataRes["address"]);
      console.log("tokenIn decimals: ", tokenDataRes["decimals"]);
      console.log("tokenIn symbol: ", tokenDataRes["symbol"]);
      console.log("tokenIn name: ", tokenDataRes["name"]);
      console.log("tokenIn logoURI: ", tokenDataRes["logoURI"]);
      console.log("tokenIn liquidity: ", tokenDataRes["liquidity"]);
      console.log("tokenIn price: ", tokenDataRes["price"]);

      const td = {
        address: tokenDataRes["address"],
        decimals: tokenDataRes["decimals"],
        symbol: tokenDataRes["symbol"],
        name: tokenDataRes["name"],
        logoURI: tokenDataRes["logoURI"],
        liquidity: tokenDataRes["liquidity"],
        price: tokenDataRes["price"]
      } as TokenData;

      setTokenInData((_) => td);
    }

    doStuff();
  }, [tokenIn]);

  useEffect(() => {
    const doStuff = async () => {
      const tokenDataRes = await getToken(tokenOut);
      console.log("tokenOut address: ", tokenDataRes["address"]);
      console.log("tokenOut decimals: ", tokenDataRes["decimals"]);
      console.log("tokenOut symbol: ", tokenDataRes["symbol"]);
      console.log("tokenOut name: ", tokenDataRes["name"]);
      console.log("tokenOut logoURI: ", tokenDataRes["logoURI"]);
      console.log("tokenOut liquidity: ", tokenDataRes["liquidity"]);
      console.log("tokenOut price: ", tokenDataRes["price"]);

      const td = {
        address: tokenDataRes["address"],
        decimals: tokenDataRes["decimals"],
        symbol: tokenDataRes["symbol"],
        name: tokenDataRes["name"],
        logoURI: tokenDataRes["logoURI"],
        liquidity: tokenDataRes["liquidity"],
        price: tokenDataRes["price"]
      } as TokenData;

      setTokenOutData((_) => td);
    }

    doStuff();
  }, [tokenOut]);

  return (
    <div className={styles.swapPageContainer}>
      <StandardHeader title={`Trade`} backButtonNavigateTo={"home"} backButtonHide={true}/>
      <div className={styles.swapComponentsContainer}>
        <div className={styles.swapFormContainer}>
          <div className={styles.swapOutTokenContainer}>
            <div className={styles.outTokenQuantityFormContainer}>
              <Form.Control
                ref={inputFieldRef}
                className={styles.outTokenQuantityForm}
                placeholder="0"
                type="text"
                value={outQuantity}
                readOnly
              />
              <div className={styles.outTokenInfoContainer}>
                <div className={styles.outTokenInfo}>
                  {
                    tokenOutData ?
                      <>
                        <Image
                          src={tokenOutData.logoURI}
                          width={24}
                          height={24}
                          alt={`${tokenOutData ? tokenOutData.symbol : "Token"} img`}
                          className={styles.tokenImage}
                        />
                        <div className={styles.outTokenSymbolContainer}>{tokenOutData.symbol}</div>
                      </>
                    :
                      <></>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className={styles.swapIconContainer}> 
            <i className="fa-solid fa-arrow-down"></i>
          </div>
          <div className={styles.swapInTokenContainer}>
            <div className={styles.inTokenQuantityFormContainer}>
              <Form.Control
                ref={inputFieldRef}
                className={styles.inTokenQuantityForm}
                placeholder="0"
                type="text"
                value={outQuantity}
                readOnly
              />
              <div className={styles.inTokenInfoContainer}>
                <div className={styles.inTokenInfo}>
                  {
                    tokenInData ?
                      <>
                        <Image
                          src={tokenInData.logoURI}
                          width={24}
                          height={24}
                          alt={`${tokenInData ? tokenInData.symbol : "Token"} img`}
                          className={styles.tokenImage}
                        />
                        <div className={styles.inTokenSymbolContainer}>{tokenInData.symbol}</div>
                      </>
                    :
                      <></>
                  }
                </div>
              </div>
            </div>
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
