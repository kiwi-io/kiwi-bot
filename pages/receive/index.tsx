import React, { useEffect, useState } from "react";
import styles from "./receive.module.css";
import { useTelegram } from "../../utils/twa";
import QRCode from "../../components/QRCode";
import { usePrivy } from "@privy-io/react-auth";
import { TokenItem, trimAddress } from "../../utils";
import StandardHeader from "../../components/StandardHeader";
import { useRouter } from "next/router";
import { useWalletContext } from "../../components/contexts";
import { Form } from "react-bootstrap";

export interface ReceiveQueryParams {
  token?: string;
}

const Receive = () => {
  const router = useRouter();

  const { token }: ReceiveQueryParams = router.query;

  const { vibrate } = useTelegram();

  const { portfolio } = useWalletContext();

  const [selectedTokenItem, setSelectedTokenItem] =
    useState<TokenItem>(undefined);
  const [selectedAmount, setSelectedAmount] = useState<string | undefined>();


    useEffect(() => {
      const doStuff = () => {
        if (token && portfolio && portfolio.items.length > 0) {
          const tokenItem = portfolio.items.filter(
            (item) => item.address === token || item.symbol === token,
          )[0];
  
          setSelectedTokenItem((_) => tokenItem);
        }
      };
  
      doStuff();
    }, [token]);

    const handleAmountChange = (e: any) => {
      try {
        setSelectedAmount((_) => e.target.value);
      } catch (e) {
        setSelectedAmount((_) => "");
      }
    };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const shareOnTelegramHandler = (username: string, address: string) => {
    const botName = "@samplekiwibot";
    let url = `https://kiwi-bot.vercel.app/pay/${username}-${address}`;
    if(selectedTokenItem) {
      url += `-${selectedTokenItem.symbol}`
    }
    if(selectedAmount) {
      url += `-${selectedAmount}`
    }
    const shareText = encodeURIComponent(`${botName} ${url}`);
    const telegramUrl = `https://t.me/share/url?url=&text=${shareText}`;
    
    window.open(telegramUrl, "_blank");
  };

  const { user, ready, authenticated } = usePrivy();

  return (
    <div className={styles.receivePageContainer}>
      <StandardHeader title={`Receive ${selectedTokenItem ? selectedTokenItem.symbol : ``}`} backButtonNavigateTo={"home"} />
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
                        selectedAmount
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
