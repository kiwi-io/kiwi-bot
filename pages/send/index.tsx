import React, { useEffect, useState } from "react";
import styles from "./send.module.css";
import { useRouter } from "next/router";
import StandardHeader from "../../components/StandardHeader";
import { increaseDimensionsInUrl, TokenItem } from "../../utils";
import { useWalletContext } from "../../components/contexts";
import { useTelegram } from "../../utils/twa";
import { Form } from "react-bootstrap";
import Image from "next/image";
import { initQRScanner } from "@telegram-apps/sdk";
import { usePrivy } from "@privy-io/react-auth";

export interface SendQueryParams {
  recipient?: string;
  token?: string;
  amount?: string;
}

const Send = () => {
  const router = useRouter();

  const { recipient, token, amount }: SendQueryParams = router.query;

  const [selectedTokenItem, setSelectedTokenItem] =
    useState<TokenItem>(undefined);
  const [selectedRecipient, setSelectedRecipient] = useState<string>(recipient);
  const [selectedAmount, setSelectedAmount] = useState<string>("0");

  const { portfolio } = useWalletContext();

  const {user} = usePrivy();

  const { vibrate } = useTelegram();

  useEffect(() => {
    const doStuff = () => {
      if (portfolio && portfolio.items.length > 0) {
        const tokenItem = portfolio.items.filter(
          (item) => item.address === token || item.symbol === token,
        )[0];

        setSelectedTokenItem((_) => tokenItem);
      }
    };

    doStuff();
    console.log("selectedTokenItem: ", selectedTokenItem);
  }, [token]);

  const handleRecipientChange = (e: any) => {
    setSelectedRecipient((_) => e.target.value);
  };

  const handleAmountChange = (e: any) => {
    try {
      setSelectedAmount((_) => e.target.value);
    } catch (e) {
      setSelectedAmount((_) => "");
    }
  };

  const handlePaste = async () => {
    try {
      // Check if the browser supports clipboard API
      if (navigator.clipboard) {
        // Read the clipboard text
        const text = await navigator.clipboard.readText();
        setSelectedRecipient((_) => text);
      } else {
        console.error("Clipboard API is not supported in this browser.");
        setSelectedRecipient((_) => "");
      }
    } catch (error) {
      console.error("Failed to read clipboard contents: ", error);
      setSelectedRecipient((_) => "");
    }
  }

  const handleScanQr = async () => {
    const qrScanner = initQRScanner();
    qrScanner.open("Scan a Solana address").then((content) => {
      setSelectedRecipient((_) => content);
    })
    .catch((err) => {
      console.log("QR Scan error: ", err);
    })
  }

  const handleMaxAmount = async () => {
    const maxAmount = selectedTokenItem.balance;
    // setSelectedAmount((_) => maxAmount.toString());
    setSelectedAmount((_) => "100"); // 100 lamports temporarily
  }

  const confirmSendHandler = async () => {
    router.push(`/send-transaction-confirmation?from=${user.wallet.address}&to=${selectedRecipient}&token=${selectedTokenItem.address}&amount=${selectedAmount}`)
  }

  return (
    <div className={styles.sendPageContainer}>
      <div className={styles.sendHeaderContainer}>
        <StandardHeader
          title={`Send ${selectedTokenItem ? selectedTokenItem.symbol : ""}`}
          backButtonNavigateTo={"tokens"}
        />
      </div>
      <div className={styles.sendBodyContainer}>
        <div className={styles.tokenImageContainer}>
          {
            selectedTokenItem ?
                <Image
                    src={increaseDimensionsInUrl(
                        selectedTokenItem.logoURI,
                        60,
                        60,
                    )}
                    width={50}
                    height={50}
                    alt={`${selectedTokenItem ? selectedTokenItem.symbol : "Token"} img`}
                    className={styles.tokenImage}
                />
            :
                <></>
          }
        </div>
        <div className={styles.sendFormContainer}>
          <Form>
            <Form.Group
              controlId="formInput"
              className={styles.formGroupContainer}
            >
              <div className={styles.formLabelAndFieldContainer}
                style = {{
                  border: 'none',
                  borderRadius: '0rem',
                  borderBottom: `2px solid #481801`,
                }}
              >
                <div className={styles.recipientFieldContainer}>
                <Form.Control
                  placeholder={"Recipient address"}
                  // disabled={!wallet.connected}
                  className={styles.recipientFormField}
                  onChange={(e) => handleRecipientChange(e)}
                  value={selectedRecipient}
                />
                <div className={styles.scanQrButton}>
                  <i className={`fa-solid fa-qrcode`}
                    onClick={
                      () => {
                        vibrate("soft");
                        // handleScanQr();
                        handlePaste();
                      }
                    }
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
              <div className={styles.formLabelAndFieldContainer}
                style = {{
                  border: 'none',
                  borderRadius: '0rem',
                  borderBottom: `2px solid #481801`,
                }}
              >
                <div className={styles.recipientFieldContainer}>
                <Form.Control
                  placeholder={"Amount"}
                  // disabled={!wallet.connected}
                  className={styles.recipientFormField}
                  onChange={(e) => handleAmountChange(e)}
                  value={
                    (parseFloat(selectedAmount) / (selectedTokenItem ? 10 ** selectedTokenItem.decimals : 1)).toString()
                  }
                />
                <div className={styles.maxAmountButton}>
                  <span
                    onClick={
                      () => {
                        vibrate("soft");
                        handleMaxAmount();
                      }
                    }
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
