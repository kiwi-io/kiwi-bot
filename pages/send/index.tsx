import React, { useEffect } from "react";
import styles from "./send.module.css";
import { useRouter } from "next/router";
import StandardHeader from "../../components/StandardHeader";
import { getAmountInLamports, increaseDimensionsInUrl } from "../../utils";
import { useTelegram } from "../../utils/twa";
import { Form } from "react-bootstrap";
import Image from "next/image";
import { useTransferContext } from "../../components/contexts/TransferContext";
import { initQRScanner } from "twa-sdk-v1";

const Send = () => {
  const router = useRouter();

  const { recipient, token, amount, updateRecipient, updateAmount } =
    useTransferContext();

  const { vibrate } = useTelegram();

  useEffect(() => {
    const doStuff = () => {
      if (!token) {
        router.push(`/tokens?navigateTo=send`);
      }
    };

    doStuff();
  }, [token]);

  const handleRecipientChange = (e: any) => {
    updateRecipient(e.target.value);
  };

  const handleAmountChange = (e: any) => {
    updateAmount(e.target.value);
  };

  const handlePaste = async () => {
    try {
      // Check if the browser supports clipboard API
      if (navigator.clipboard) {
        // Read the clipboard text
        const text = await navigator.clipboard.readText();
        updateRecipient(text);
      } else {
        console.error("Clipboard API is not supported in this browser.");
      }
    } catch (error) {
      console.error("Failed to read clipboard contents: ", error);
    }
  };

  const handleScanQr = async () => {
    const qrScanner = initQRScanner();
    qrScanner.open("Scan a Solana address").then((content) => {
      updateRecipient(content);
    })
    .catch((err) => {
      console.log("QR Scan error: ", err);
    })
  }

  const handleMaxAmount = async () => {
    let maxAmount = getAmountInLamports(
      token.balance.toString(),
      token ? token.decimals : 1,
    );
    updateAmount(maxAmount.toString());
  };

  const confirmSendHandler = async () => {
    router.push(`/send-transaction-confirmation`);
  };

  return (
    <div className={styles.sendPageContainer}>
      <div className={styles.sendHeaderContainer}>
        <StandardHeader
          title={`Send ${token ? token.symbol : ""}`}
          backButtonNavigateTo={"home"}
        />
      </div>
      <div className={styles.sendBodyContainer}>
        <div className={styles.tokenImageContainer}>
          {token ? (
            <Image
              src={increaseDimensionsInUrl(token.logoURI, 60, 60)}
              width={50}
              height={50}
              alt={`${token ? token.symbol : "Token"} img`}
              className={styles.tokenImage}
            />
          ) : (
            <></>
          )}
        </div>
        <div className={styles.sendFormContainer}>
          <Form>
            <Form.Group
              controlId="formInput"
              className={styles.formGroupContainer}
            >
              <div
                className={styles.formLabelAndFieldContainer}
                style={{
                  border: "none",
                  borderRadius: "0rem",
                  borderBottom: `2px solid #481801`,
                }}
              >
                <div className={styles.recipientFieldContainer}>
                  <Form.Control
                    placeholder={"Paste Solana address"}
                    // disabled={!wallet.connected}
                    className={styles.recipientFormField}
                    onChange={(e) => handleRecipientChange(e)}
                    value={recipient}
                  />
                  <div className={styles.scanQrButton}>
                    <i
                      className={`fa-solid fa-qrcode`}
                      onClick={() => {
                        vibrate("soft");
                        handleScanQr();
                        // handlePaste();
                      }}
                    ></i>
                  </div>
                  {/* <div className={styles.pasteAddressButton}>
                  <i className={`fa-regular fa-paste`}
                    onClick={
                      () => {
                        vibrate("soft");
                        handlePaste();
                      }
                    }
                  ></i>
                </div> */}
                </div>
              </div>
            </Form.Group>
          </Form>
          <Form>
            <Form.Group
              controlId="formInput"
              className={styles.formGroupContainer}
            >
              <div
                className={styles.formLabelAndFieldContainer}
                style={{
                  border: "none",
                  borderRadius: "0rem",
                  borderBottom: `2px solid #481801`,
                }}
              >
                <div className={styles.recipientFieldContainer}>
                  <Form.Control
                    placeholder={"Amount"}
                    className={styles.recipientFormField}
                    onChange={(e) => handleAmountChange(e)}
                    value={amount}
                  />
                  <div className={styles.maxAmountButton}>
                    <span
                      onClick={() => {
                        vibrate("soft");
                        handleMaxAmount();
                      }}
                    >
                      MAX
                    </span>
                  </div>
                </div>
              </div>
            </Form.Group>
          </Form>
        </div>
        <div
          className={styles.sendExecuteContainer}
          onClick={() => {
            vibrate("light");
            confirmSendHandler();
          }}
        >
          Send
        </div>
      </div>
    </div>
  );
};

export default Send;
