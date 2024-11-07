import React, { useEffect, useState } from "react";
import styles from "./swap.module.css";
import StandardHeader from "../../components/StandardHeader";
import { useTelegram } from "../../utils/twa";
import { getTelegramUserData, triggerNotification } from "../../utils";
import { Form } from "react-bootstrap";
import { useJupiterSwapContext } from "../../components/contexts/JupiterSwapContext";
import Image from "next/image";
import { fetchQuote, swapOnJupiterTx } from "../../utils/jupiter/api";
import { usePrivy, useSolanaWallets } from "@privy-io/react-auth";
import {
  Connection,
  PublicKey,
  SystemProgram,
  VersionedTransaction,
  TransactionMessage,
  AddressLookupTableAccount,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
} from "@solana/web3.js";
import { useRouter } from "next/router";
import {
  KIWI_MULTISIG,
  KIWI_TRADING_FEE_PCT,
  MAX_SLIPPAGE,
  REFERRAL_FEE_PCT,
  WRAPPED_SOL_MAINNET,
} from "../../constants";
import { useWalletContext } from "../../components/contexts";
import { useActivePageContext } from "../../components/contexts/ActivePageContext";

const Swap = () => {
  const [swapButtonText, setSwapButtonText] = useState<string>("Swap");
  const [isSwapExecuting, setIsSwapExecuting] = useState<boolean>(false);

  const [outQuantity, setOutQuantity] = useState<string>(``);
  const [inQuantity, setInQuantity] = useState<string>(``);

  const [outWalletQuantity, setOutWalletQuantity] = useState<string>(``);
  const [inWalletQuantity, setInWalletQuantity] = useState<string>(``);

  const [isDecimalEntered, setIsDecimalEntered] = useState<boolean>(false);

  const { referralSession } = useActivePageContext();

  const { portfolio, updatePortfolio } = useWalletContext();
  const {
    tokenIn,
    tokenOut,
    tokenInData,
    tokenOutData,
    updateTokenIn,
    updateTokenOut,
    updateTokenInData,
    updateTokenOutData,
    referrer,
  } = useJupiterSwapContext();

  const { vibrate } = useTelegram();
  const { wallets } = useSolanaWallets();
  const { user } = usePrivy();
  const router = useRouter();

  const handleKeypadInput = (value: any) => {
    if (isSwapExecuting) {
      return;
    }

    vibrate("light");
    // Prevent multiple decimals
    if (value === "." && outQuantity.includes(".")) return;
    setOutQuantity((prev) => prev + value);
  };

  const handleBackspace = () => {
    if (isSwapExecuting) {
      return;
    }

    vibrate("light");
    setOutQuantity((prev) => prev.slice(0, -1));
  };

  const handleSideChange = () => {
    if (isSwapExecuting) {
      return;
    }

    vibrate("light");

    const tempIn = tokenInData;
    updateTokenIn(tokenOutData.address);
    updateTokenOut(tempIn.address);
    updateTokenInData(tokenOutData);
    updateTokenOutData(tempIn);
    setOutQuantity((_) => outQuantity);
  };

  const performSwapAction = async () => {
    if (isSwapExecuting) {
      return;
    }

    vibrate("light");
    setIsSwapExecuting((_) => true);
    setSwapButtonText((_) => `Executing...`);

    const connection = new Connection(
      process.env.NEXT_RPC_MAINNET_URL,
      "confirmed",
    );

    const outQuantityDecimals =
      parseFloat(outQuantity) * 10 ** tokenOutData.decimals;

    const isBuy = tokenOutData.symbol === "SOL";

    let totalFee = 0;
    if (isBuy) {
      totalFee = outQuantityDecimals * (KIWI_TRADING_FEE_PCT / 100);
    } else {
      if (inQuantity) {
        totalFee =
          parseFloat(inQuantity) *
          10 ** tokenInData.decimals *
          (KIWI_TRADING_FEE_PCT / 100);
      }
    }

    totalFee = parseInt(totalFee.toString());

    const jupiterTxSerialized = await swapOnJupiterTx({
      userPublicKey: wallets[0].address,
      inputMint: tokenOutData.address,
      outputMint: tokenInData.address,
      amountIn: outQuantityDecimals,
      slippage: MAX_SLIPPAGE,
    });

    const swapTransactionBuf = Buffer.from(jupiterTxSerialized, "base64");
    var jupiterTx = VersionedTransaction.deserialize(swapTransactionBuf);

    let signature = "";

    const referrerData = await getTelegramUserData(referrer);

    let referrerAddress = KIWI_MULTISIG;
    if (referrerData && referrerData["linked_accounts"][1]["address"]) {
      referrerAddress = referrerData["linked_accounts"][1]["address"];
    }

    const referralFee = parseInt(
      (totalFee * (REFERRAL_FEE_PCT / 100)).toString(),
    );

    const feeTransferInstruction = SystemProgram.transfer({
      fromPubkey: new PublicKey(wallets[0].address),
      toPubkey: KIWI_MULTISIG,
      lamports: totalFee - referralFee,
    });

    const referrerBalance = await connection.getBalance(
      new PublicKey(referrerAddress),
    );
    const rentExemptMin = await connection.getMinimumBalanceForRentExemption(0);

    let referralFeeTransferInstruction: TransactionInstruction;

    if (referrerBalance < rentExemptMin) {
      referralFeeTransferInstruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(wallets[0].address),
        toPubkey: KIWI_MULTISIG,
        lamports: referralFee,
      });
    } else {
      referralFeeTransferInstruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(wallets[0].address),
        toPubkey: new PublicKey(referrerAddress),
        lamports: referralFee,
      });
    }

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

    const originalTxMessage = TransactionMessage.decompile(jupiterTx.message, {
      addressLookupTableAccounts: addressLookupTableAccounts,
    });

    if (isBuy) {
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

      signature = await connection.sendTransaction(signedTx, {
        skipPreflight: false,
        preflightCommitment: "processed",
        maxRetries: 3,
      });
      console.log("signature: ", signature);

      if (
        referrerData &&
        referrerData["linked_accounts"][0]["telegram_user_id"]
      ) {
        if (referrerBalance < rentExemptMin) {
          await triggerNotification(
            referrer,
            `Load at least 0.01 SOL in your wallet to start receiving referral fees.`,
          );
        } else {
          await triggerNotification(
            referrer,
            `📣 Somebody just ${isBuy ? `bought` : `sold`} ${isBuy ? tokenInData.symbol : tokenOutData.symbol} using your referral. \n\n💰 Referral fee earned: ${referralFee / LAMPORTS_PER_SOL} SOL (~$${((referralFee / LAMPORTS_PER_SOL) * (isBuy ? tokenOutData.price : tokenInData.price)).toFixed(6)}) 🤑`,
          );
        }
      }
    } catch (err) {
      console.log("Error submitting tx second time: ", err);

      setIsSwapExecuting((_) => false);
      router.push(`/transaction-status?type=error&error=${err}`);
      return;
    }

    // try once
    // try {
    //   const signature = await wallets[0].sendTransaction(jupiterTx, connection);
    //   console.log("signature: ", signature);
    // } catch (err) {
    //   console.log("Error as expected: ", err);

    //   const referrerData = await getTelegramUserData(referrer);

    //   let referrerAddress = KIWI_MULTISIG;
    //   if (referrerData && referrerData["linked_accounts"][1]["address"]) {
    //     referrerAddress = referrerData["linked_accounts"][1]["address"];
    //   }

    //   const referralFee = parseInt(
    //     (totalFee * (REFERRAL_FEE_PCT / 100)).toString(),
    //   );

    //   const feeTransferInstruction = SystemProgram.transfer({
    //     fromPubkey: new PublicKey(wallets[0].address),
    //     toPubkey: KIWI_MULTISIG,
    //     lamports: totalFee - referralFee,
    //   });

    //   const referrerBalance = await connection.getBalance(
    //     new PublicKey(referrerAddress),
    //   );
    //   const rentExemptMin =
    //     await connection.getMinimumBalanceForRentExemption(0);

    //   let referralFeeTransferInstruction: TransactionInstruction;

    //   if (referrerBalance < rentExemptMin) {
    //     referralFeeTransferInstruction = SystemProgram.transfer({
    //       fromPubkey: new PublicKey(wallets[0].address),
    //       toPubkey: KIWI_MULTISIG,
    //       lamports: referralFee,
    //     });
    //   } else {
    //     referralFeeTransferInstruction = SystemProgram.transfer({
    //       fromPubkey: new PublicKey(wallets[0].address),
    //       toPubkey: new PublicKey(referrerAddress),
    //       lamports: referralFee,
    //     });
    //   }

    //   const addressLookupTableAccounts = await Promise.all(
    //     jupiterTx.message.addressTableLookups.map(async (lookup) => {
    //       return new AddressLookupTableAccount({
    //         key: lookup.accountKey,
    //         state: AddressLookupTableAccount.deserialize(
    //           await connection
    //             .getAccountInfo(lookup.accountKey)
    //             .then((res) => res.data),
    //         ),
    //       });
    //     }),
    //   );

    //   const originalTxMessage = TransactionMessage.decompile(
    //     jupiterTx.message,
    //     {
    //       addressLookupTableAccounts: addressLookupTableAccounts,
    //     },
    //   );

    //   if (isBuy) {
    //     originalTxMessage.instructions.unshift(feeTransferInstruction);
    //     originalTxMessage.instructions.unshift(referralFeeTransferInstruction);
    //   } else if (tokenInData.symbol === "SOL") {
    //     originalTxMessage.instructions.push(feeTransferInstruction);
    //     originalTxMessage.instructions.push(referralFeeTransferInstruction);
    //   }

    //   jupiterTx.message = originalTxMessage.compileToV0Message(
    //     addressLookupTableAccounts,
    //   );

    //   try {
    //     const signedTx = await wallets[0].signTransaction(jupiterTx);

    //     signature = await connection.sendTransaction(signedTx, {
    //       skipPreflight: false,
    //       preflightCommitment: "processed",
    //       maxRetries: 3,
    //     });
    //     console.log("signature: ", signature);

    //     if (
    //       referrerData &&
    //       referrerData["linked_accounts"][0]["telegram_user_id"]
    //     ) {
    //       if (referrerBalance < rentExemptMin) {
    //         await triggerNotification(
    //           referrer,
    //           `Load at least 0.01 SOL in your wallet to start receiving referral fees.`,
    //         );
    //       } else {
    //         await triggerNotification(
    //           referrer,
    //           `📣 Somebody just ${isBuy ? `bought` : `sold`} ${isBuy ? tokenInData.symbol : tokenOutData.symbol} using your referral. \n\n💰 Referral fee earned: ${referralFee / LAMPORTS_PER_SOL} SOL (~$${((referralFee / LAMPORTS_PER_SOL) * (isBuy ? tokenOutData.price : tokenInData.price)).toFixed(6)}) 🤑`,
    //         );
    //       }
    //     }
    //   } catch (err) {
    //     console.log("Error submitting tx second time: ", err);

    //     setIsSwapExecuting((_) => false);
    //     router.push(`/transaction-status?type=error&error=${err}`);
    //     return;
    //   }
    // }

    setIsSwapExecuting((_) => false);
    router.push(`/transaction-status?type=success&signature=${signature}`);
  };

  const updateWalletQuantities = async () => {
    console.log("Portfolio before: ", portfolio);
    console.log("Calling updatePortfolio");
    console.log("user: ", user);
    await updatePortfolio(user);
    console.log("Portfolio after: ", portfolio);
    if (portfolio) {
      const tokenInMatch = portfolio.items.filter((i) => {
        if (
          i.address === "So11111111111111111111111111111111111111111" &&
          tokenIn === WRAPPED_SOL_MAINNET
        ) {
          return true;
        } else {
          return i.address === tokenIn;
        }
      });

      const tokenOutMatch = portfolio.items.filter((i) => {
        if (
          i.address === "So11111111111111111111111111111111111111111" &&
          tokenOut === WRAPPED_SOL_MAINNET
        ) {
          return true;
        } else {
          return i.address === tokenOut;
        }
      });

      console.log("tokenInMatch: ", tokenInMatch);
      console.log("tokenOutMatch: ", tokenOutMatch);

      if (tokenInMatch && tokenInMatch.length > 0) {
        const sizeInfo = tokenInMatch[0];

        if (sizeInfo) {
          setInWalletQuantity((_) => sizeInfo.uiAmount.toString());
        }
      }

      if (tokenOutMatch && tokenOutMatch.length > 0) {
        const sizeInfo = tokenOutMatch[0];

        if (sizeInfo) {
          setOutWalletQuantity((_) => sizeInfo.uiAmount.toString());
        }
      }
    }
  };

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

      if (outQuantity === "") {
        setInQuantity((_) => "");
      }
    };

    doStuff();
  }, [outQuantity]);

  useEffect(() => {
    const doStuff = async () => {
      if (!tokenInData) {
        updateTokenInData(tokenIn);
      }
    };

    doStuff();
  }, [tokenIn]);

  useEffect(() => {
    const doStuff = async () => {
      if (!tokenOutData) {
        updateTokenOutData(tokenOut);

        if (portfolio) {
          const match = portfolio.items.filter((i) => {
            i.address === tokenOut;
          });

          if (match && match.length > 0) {
            const sizeInfo = match[0];

            if (sizeInfo) {
              setOutWalletQuantity((_) => sizeInfo.uiAmount.toString());
            }
          }
        }
      }
    };

    doStuff();
  }, [tokenOut]);

  useEffect(() => {
    updateWalletQuantities();
  }, [user, tokenIn, tokenOut]);

  // do this so that on opening direct swap links, the tokens are refreshed and there is
  // data on quantities and balance
  useEffect(() => {
    const doStuff = () => {
      updateTokenIn(tokenInData.address);
      updateTokenOut(tokenOutData.address);
      updateTokenInData(tokenInData);
      updateTokenOutData(tokenOutData);
    };

    doStuff();
  }, [referralSession]);

  return (
    <div className={styles.swapPageContainer}>
      <StandardHeader
        title={`Swap`}
        backButtonNavigateTo={"/home"}
        backButtonHide={true}
      />
      <div className={styles.swapComponentsContainer}>
        <div className={styles.swapFormContainer}>
          <div className={styles.swapOutTokenContainer}>
            <div className={styles.outTokenQuantityFormContainer}>
              <Form.Control
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
            <div className={styles.outTokenExtraInfoContainer}>
              <div className={styles.outTokenDollarQuantityContainer}>
                {tokenOutData && outQuantity ? (
                  <>{`$ ${(parseFloat(outQuantity) * tokenOutData.price).toFixed(3)}`}</>
                ) : (
                  <>{` `}</>
                )}
              </div>
              <div className={styles.outTokenActualQuantityContainer}>
                {outWalletQuantity ? <>{`${outWalletQuantity}`}</> : <></>}
              </div>
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
            <div className={styles.inTokenExtraInfoContainer}>
              <div className={styles.inTokenDollarQuantityContainer}>
                {tokenInData && inQuantity ? (
                  <>{`$ ${(parseFloat(inQuantity) * tokenInData.price).toFixed(3)}`}</>
                ) : (
                  <>{` `}</>
                )}
              </div>
              <div className={styles.inTokenActualQuantityContainer}>
                {inWalletQuantity ? <>{`${inWalletQuantity}`}</> : <></>}
              </div>
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
              opacity: isSwapExecuting ? `50%` : `100%`,
            }}
          >
            <div>{swapButtonText}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;
