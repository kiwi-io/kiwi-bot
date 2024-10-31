import React, { useEffect, useRef, useState } from "react";
import styles from "./swap.module.css";
import StandardHeader from "../../components/StandardHeader";
import { useTelegram } from "../../utils/twa";
import { getTelegramUserData, getToken, TokenData } from "../../utils";
import { Form } from "react-bootstrap";
import { useJupiterSwapContext } from "../../components/contexts/JupiterSwapContext";
import Image from "next/image";
import { fetchQuote, swapOnJupiterTx } from "../../utils/jupiter/api";
import { useSolanaWallets } from "@privy-io/react-auth";
import {
  Connection,
  PublicKey,
  SystemProgram,
  VersionedTransaction,
  TransactionMessage,
  AddressLookupTableAccount,
} from "@solana/web3.js";
import { useRouter } from "next/router";
import { KIWI_MULTISIG } from "../../constants";

const Swap = () => {
  const [swapButtonText, setSwapButtonText] = useState<string>("Swap");
  const [isSwapExecuting, setIsSwapExecuting] = useState<boolean>(false);

  const [outQuantity, setOutQuantity] = useState<string>(``);
  const [inQuantity, setInQuantity] = useState<string>(``);
  const inputFieldRef = useRef(null);

  const [isDecimalEntered, setIsDecimalEntered] = useState<boolean>(false);

  const [tokenInData, setTokenInData] = useState<TokenData>();
  const [tokenOutData, setTokenOutData] = useState<TokenData>();

  const handleKeypadInput = (value: any) => {
    if(isSwapExecuting) {
      return;
    }

    vibrate("light");
    // Prevent multiple decimals
    if (value === "." && outQuantity.includes(".")) return;
    setOutQuantity((prev) => prev + value);
  };

  const handleBackspace = () => {
    if(isSwapExecuting) {
      return;
    }

    vibrate("light");
    setOutQuantity((prev) => prev.slice(0, -1));
  };

  const handleSideChange = () => {
    if(isSwapExecuting) {
      return;
    }

    vibrate("light");

    const tempIn = tokenInData;
    setTokenInData((_) => tokenOutData);
    setTokenOutData((_) => tempIn);
  };

  const { vibrate } = useTelegram();
  const { wallets } = useSolanaWallets();
  const router = useRouter();

  const { tokenIn, tokenOut, referrer } = useJupiterSwapContext();

  const performSwapAction = async () => {
    vibrate("light");
    setIsSwapExecuting((_) => true);
    setSwapButtonText((_) => `Executing...`);

    const connection = new Connection(
      process.env.NEXT_RPC_MAINNET_URL,
      "confirmed",
    );

    const outQuantityDecimals =
      parseFloat(outQuantity) * 10 ** tokenOutData.decimals;

    let totalFee = 0;
    if (tokenOutData.symbol === "SOL") {
      totalFee = outQuantityDecimals * 0.01;
    } else {
      if (inQuantity) {
        totalFee = parseFloat(inQuantity) * 10 ** tokenInData.decimals * 0.01;
      }
    }

    totalFee = parseInt(totalFee.toString());

    console.log("totalFee: ", totalFee);

    const jupiterTxSerialized = await swapOnJupiterTx({
      userPublicKey: wallets[0].address,
      inputMint: tokenOutData.address,
      outputMint: tokenInData.address,
      amountIn: outQuantityDecimals,
      slippage: 300,
    });

    console.log("jup tx fetched");

    const swapTransactionBuf = Buffer.from(jupiterTxSerialized, "base64");
    var jupiterTx = VersionedTransaction.deserialize(swapTransactionBuf);

    let signature = "";

    // try once
    try {
      
      const signature = await wallets[0].sendTransaction(jupiterTx, connection);
      console.log("signature: ", signature);

    } catch (err) {
      console.log("Error as expected: ", err);

      const referrerData = await getTelegramUserData(referrer);

      let referrerAddress = KIWI_MULTISIG;
      if(referrerData && referrerData["linked_accounts"][1]["address"]) {
        referrerAddress = referrerData["linked_accounts"][1]["address"];
      }

      const referralFee = parseInt((totalFee / 2).toString());

      const feeTransferInstruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(wallets[0].address),
        toPubkey: KIWI_MULTISIG,
        lamports: totalFee - referralFee,
      });

      const referralFeeTransferInstruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(wallets[0].address),
        toPubkey: new PublicKey(referrerAddress),
        lamports: referralFee,
      });

      const addressLookupTableAccounts = await Promise.all(
        jupiterTx.message.addressTableLookups.map(async (lookup) => {
          return new AddressLookupTableAccount({
            key: lookup.accountKey,
            state: AddressLookupTableAccount.deserialize(
              await connection
                .getAccountInfo(lookup.accountKey)
                .then((res) => res.data),
            ),
          });
        }),
      );

      const originalTxMessage = TransactionMessage.decompile(
        jupiterTx.message,
        {
          addressLookupTableAccounts: addressLookupTableAccounts,
        },
      );

      if (tokenOutData.symbol === "SOL") {
        originalTxMessage.instructions.unshift(feeTransferInstruction);
        originalTxMessage.instructions.unshift(referralFeeTransferInstruction);
      } else if (tokenInData.symbol === "SOL") {
        originalTxMessage.instructions.push(feeTransferInstruction);
        originalTxMessage.instructions.push(referralFeeTransferInstruction);
      }

      jupiterTx.message = originalTxMessage.compileToV0Message(
        addressLookupTableAccounts,
      );

      try {
        const signedTx = await wallets[0].signTransaction(jupiterTx);

        console.log("signed");

        signature = await connection.sendTransaction(signedTx, {
          skipPreflight: false,
          preflightCommitment: "processed",
          maxRetries: 3,
        });
        console.log("signature: ", signature);
      }
      catch(err) {
        console.log("Error submitting tx second time: ", err);
        
        setIsSwapExecuting((_) => false);
        router.push(`/transaction-status?type=error&error=${err}`);
      }
    }

    setIsSwapExecuting((_) => false);
    router.push(`/transaction-status?type=success&signature=${signature}`);
  };

  useEffect(() => {
    if (inputFieldRef.current) {
      inputFieldRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const doStuff = async () => {
      if (outQuantity.includes(".")) {
        setIsDecimalEntered((_) => true);
      } else {
        setIsDecimalEntered((_) => false);
      }

      const outQuantityDecimals =
        parseFloat(outQuantity) * 10 ** tokenOutData.decimals;

      if (outQuantityDecimals > 0) {
        let inQuantityQuote = await fetchQuote(
          tokenOutData.address,
          tokenInData.address,
          outQuantityDecimals,
          300,
        );
        setInQuantity((_) =>
          (inQuantityQuote.outAmount / 10 ** tokenInData.decimals).toString(),
        );
      } else {
        setInQuantity((_) => "");
      }
    };

    doStuff();
  }, [outQuantity]);

  useEffect(() => {
    const doStuff = async () => {
      const tokenDataRes = await getToken(tokenIn);

      const td = {
        address: tokenDataRes["address"],
        decimals: tokenDataRes["decimals"],
        symbol: tokenDataRes["symbol"],
        name: tokenDataRes["name"],
        logoURI: tokenDataRes["logoURI"],
        liquidity: tokenDataRes["liquidity"],
        price: tokenDataRes["price"],
      } as TokenData;

      setTokenInData((_) => td);
    };

    doStuff();
  }, [tokenIn]);

  useEffect(() => {
    const doStuff = async () => {
      const tokenDataRes = await getToken(tokenOut);

      const td = {
        address: tokenDataRes["address"],
        decimals: tokenDataRes["decimals"],
        symbol: tokenDataRes["symbol"],
        name: tokenDataRes["name"],
        logoURI: tokenDataRes["logoURI"],
        liquidity: tokenDataRes["liquidity"],
        price: tokenDataRes["price"],
      } as TokenData;

      setTokenOutData((_) => td);
    };

    doStuff();
  }, [tokenOut]);

  return (
    <div className={styles.swapPageContainer}>
      <StandardHeader
        title={`Trade`}
        backButtonNavigateTo={"home"}
        backButtonHide={true}
      />
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
                  {tokenOutData ? (
                    <>
                      <Image
                        src={tokenOutData.logoURI}
                        width={24}
                        height={24}
                        alt={`${tokenOutData ? tokenOutData.symbol : "Token"} img`}
                        className={styles.tokenImage}
                      />
                      <div className={styles.outTokenSymbolContainer}>
                        {tokenOutData.symbol}
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.outTokenDollarQuantityContainer}>
              {tokenOutData && outQuantity ? (
                <>{`$ ${parseFloat(outQuantity) * tokenOutData.price}`}</>
              ) : (
                <>{` `}</>
              )}
            </div>
          </div>
          <div
            className={styles.swapIconContainer}
            onClick={() => {
              handleSideChange();
            }}
          >
            <i className="fa-solid fa-arrow-down"></i>
          </div>
          <div className={styles.swapInTokenContainer}>
            <div className={styles.inTokenQuantityFormContainer}>
              <Form.Control
                className={styles.inTokenQuantityForm}
                placeholder="0"
                type="text"
                value={inQuantity}
                readOnly
              />
              <div className={styles.inTokenInfoContainer}>
                <div className={styles.inTokenInfo}>
                  {tokenInData ? (
                    <>
                      <Image
                        src={tokenInData.logoURI}
                        width={24}
                        height={24}
                        alt={`${tokenInData ? tokenInData.symbol : "Token"} img`}
                        className={styles.tokenImage}
                      />
                      <div className={styles.inTokenSymbolContainer}>
                        {tokenInData.symbol}
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.inTokenDollarQuantityContainer}>
              {tokenInData && inQuantity ? (
                <>{`$ ${parseFloat(inQuantity) * tokenInData.price}`}</>
              ) : (
                <>{` `}</>
              )}
            </div>
          </div>
        </div>
        <div className={styles.swapInputContainer}>
          <div className={styles.numKeypadContainer}>
            {[
              `7`,
              `8`,
              `9`,
              `4`,
              `5`,
              `6`,
              "1",
              `2`,
              `3`,
              `.`,
              `0`,
              <i className="fa-solid fa-arrow-left"></i>,
            ].map((value, index) => {
              return (
                <div
                  key={index}
                  className={styles.numKeyContainer}
                  style={{
                    opacity: value === "." && isDecimalEntered ? 0.5 : 1.0,
                  }}
                  onClick={() => {
                    if (typeof value === `string`) {
                      handleKeypadInput(value);
                    } else {
                      handleBackspace();
                    }
                  }}
                >
                  {value}
                </div>
              );
            })}
          </div>
          <div
            className={styles.swapButtonContainer}
            onClick={() => {
              performSwapAction();
            }}
            style={{
              opacity: isSwapExecuting ? `50%` : `100%`
            }}
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
  );
};

export default Swap;
