import React from "react";
import styles from "./receive.module.css";
import { useTelegram } from "../../utils/twa";
import QRCode from "../../components/QRCode";
import { usePrivy } from "@privy-io/react-auth";
import { trimAddress } from "../../utils";
import StandardHeader from "../../components/StandardHeader";

const Receive = () => {
  const { vibrate } = useTelegram();

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const shareOnTelegramHandler = (username: string) => {
    const botName = "@samplekiwibot";
    const url = `https://kiwi-bot.vercel.app/pay/${username}`;
    const shareText = encodeURIComponent(`${botName} ${url}`);
    const telegramUrl = `https://t.me/share/url?url=&text=${shareText}`;

    // Redirect user to the Telegram share URL
    window.open(telegramUrl, "_blank");
  };

  const { user, ready, authenticated } = usePrivy();

  return (
    <div className={styles.receivePageContainer}>
      <StandardHeader title={"Receive"} backButtonNavigateTo={"home"} />
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
          <div
            className={styles.shareOnTelegramButtonContainer}
            onClick={() => {
              vibrate("light");
              shareOnTelegramHandler(user.telegram.username);
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
