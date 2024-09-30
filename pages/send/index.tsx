import React, { useEffect, useState } from "react";
import styles from "./send.module.css";
import { useRouter } from "next/router";
import StandardHeader from "../../components/StandardHeader";
import { increaseDimensionsInUrl, TokenItem } from "../../utils";
import { useWalletContext } from "../../components/contexts";
import { Form } from "react-bootstrap";
import Image from "next/image";

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
  const [selectedAmount, setSelectedAmount] = useState<string>(amount);

  const { portfolio } = useWalletContext();

  useEffect(() => {
    const doStuff = () => {
      if (portfolio && portfolio.items.length > 0) {
        const tokenItem = portfolio.items.filter(
          (item) => item.address === token,
        )[0];

        setSelectedTokenItem((_) => tokenItem);
      }
    };

    doStuff();
  }, [token]);

  const handleRecipientChange = (e: any) => {
    setSelectedRecipient((_) => e.target.value);
  };

  const handleAmountChange = (e: any) => {
    try {
      const parsedAmount = parseFloat(e.target.value);
      setSelectedAmount((_) => parsedAmount.toString());
    } catch (e) {
      setSelectedAmount((_) => "");
    }
  };

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
          <Image
            src={increaseDimensionsInUrl(
              selectedTokenItem
                ? selectedTokenItem.logoURI
                : "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
              60,
              60,
            )}
            width={75}
            height={75}
            alt={`${selectedTokenItem ? selectedTokenItem.symbol : "Token"} img`}
            className={styles.tokenImage}
          />
        </div>
        <div className={styles.sendFormContainer}>
          <Form>
            <Form.Group
              controlId="formInput"
              className={styles.formGroupContainer}
            >
              <div className={styles.formLabelAndFieldContainer}>
                <Form.Label className={styles.formLabelContainer}>
                  <span>Recipient</span>
                </Form.Label>
                <Form.Control
                  placeholder={"Recipient address"}
                  // disabled={!wallet.connected}
                  className={styles.formFieldContainer}
                  onChange={(e) => handleRecipientChange(e)}
                  value={selectedRecipient}
                />
              </div>
            </Form.Group>
          </Form>
          <Form>
            <Form.Group
              controlId="formInput"
              className={styles.formGroupContainer}
            >
              <div className={styles.formLabelAndFieldContainer}>
                <Form.Label className={styles.formLabelContainer}>
                  <span>Amount</span>
                </Form.Label>
                <Form.Control
                  placeholder={"Amount"}
                  // disabled={!wallet.connected}
                  className={styles.formFieldContainer}
                  onChange={(e) => handleAmountChange(e)}
                  value={selectedAmount}
                />
              </div>
            </Form.Group>
          </Form>
        </div>
        <div className={styles.sendExecuteContainer}></div>
      </div>
    </div>
  );
};

export default Send;
