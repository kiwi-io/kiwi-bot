import React, { useEffect } from "react";
import styles from "./receive.module.css";
import { useTelegram } from "../../utils/twa";
import QRCode from "../../components/QRCode";
import { usePrivy } from "@privy-io/react-auth";
import { trimAddress } from "../../utils";
import StandardHeader from "../../components/StandardHeader";
import { Form } from "react-bootstrap";
import { useTransferContext } from "../../components/contexts/TransferContext";
import { useRouter } from "next/router";

export interface ReceiveQueryParams {
  token?: string;
}

const Receive = () => {
  const { token, amount, updateAmount } = useTransferContext();

  const { vibrate } = useTelegram();

  const router = useRouter();

    const handleAmountChange = (e: any) => {
      updateAmount(e.target.value);
    };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const shareOnTelegramHandler = (username: string, address: string) => {
    const botName = "@samplekiwibot";
    let url = `https://kiwi-bot.vercel.app/pay/${username}-${address}`;
    if(token) {
      url += `-${token.symbol}`
    }
    if(amount) {
      url += `-${amount}`
    }
    const shareText = encodeURIComponent(`${botName} ${url}`);
    const telegramUrl = `https://t.me/share/url?url=&text=${shareText}`;
    
    window.open(telegramUrl, "_blank");
  };

  const { user, ready, authenticated } = usePrivy();

  return (
    <div className={styles.receivePageContainer}>
      <StandardHeader title={`Receive ${token ? token.symbol : ``}`} backButtonNavigateTo={"home"} />
      {user && ready && authenticated ? (
        <div className={styles.walletInfoContainer}>
          <div className={styles.qrCodeContainer}>
            <QRCode data={user.wallet.address} />
          </div>
          <div className={styles.addressCopyContainer}>
            <span className={styles.addressContainer}>
              {trimAddress(user.wallet.address)}
            </span>
            <span
              className={styles.copyAddressContainer}
              onClick={() => {
                vibrate("soft");
                copyToClipboard(user.wallet.address);
              }}
            >
              Copy
            </span>
          </div>
          <div className={styles.receiveFormContainer}>
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
                      className={styles.recipientFormField}
                      onChange={(e) => handleAmountChange(e)}
                      value={
                        amount
                      }
                    />
                  </div>
                </div>
              </Form.Group>
            </Form>
          </div>
          <div
            className={styles.shareOnTelegramButtonContainer}
            onClick={() => {
              vibrate("light");
              shareOnTelegramHandler(user.telegram.username, user.wallet.address);
            }}
          >
            Share on Telegram
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Receive;
