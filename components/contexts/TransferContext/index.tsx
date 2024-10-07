import React from "react";
import { useState, createContext, useContext } from "react";
import { TokenItem } from "../../../utils";

interface TransferContextType {
  sender: string;
  recipient: string;
  token: TokenItem;
  amount: string;
  updateSender: (sender: string) => void;
  updateRecipient: (recipient: string) => void;
  updateToken: (token: TokenItem) => void;
  updateAmount: (amount: string) => void;
}

const TransferContext = createContext<TransferContextType | undefined>(undefined);

export const useTransferContext = () => {
  const context = useContext(TransferContext);
  if (!context) {
    throw new Error(
      "useTransferContext must be used within a TransferContextProvider",
    );
  }
  return context;
};

//@ts-ignore
export const TransferContextProvider = ({ children }) => {
    const [sender, setSender] = useState<string>("");
    const [recipient, setRecipient] = useState<string>("");
    const [token, setToken] = useState<TokenItem>();
    const [amount, setAmount] = useState<string>("");


    const updateSender = (sender: string) => {
        setSender((_) => sender);
    }

    const updateRecipient = (recipient: string) => {
        setRecipient((_) => recipient);
    }

    const updateToken = (token: TokenItem) => {
        setToken((_) => token);
    }

    const updateAmount = (amount: string) => {
        setAmount((_) => amount);
    }

  const value = {
    sender,
    recipient,
    token,
    amount,
    updateSender,
    updateRecipient,
    updateToken,
    updateAmount
  } as TransferContextType;

  return (
    <TransferContext.Provider value={value}>{children}</TransferContext.Provider>
  );
};
