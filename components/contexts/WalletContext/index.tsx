import { User } from "@privy-io/react-auth";
import React from "react";
import { useState, createContext, useContext } from "react";
import { getWalletPortfolio, TokenItem, WalletPortfolio } from "../../../utils";
import axios from "axios";
import { LinkedAccountWithMetadata } from "@privy-io/server-auth";

interface WalletContextType {
  portfolio: WalletPortfolio;
  users: LinkedAccountWithMetadata[];
  updatePortfolio: (user: User) => Promise<void>;
  updateUsersDb: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error(
      "useWalletContext must be used within a WalletContextProvider",
    );
  }
  return context;
};

//@ts-ignore
export const WalletContextProvider = ({ children }) => {
  const [portfolio, setPortfolio] = useState<WalletPortfolio>({
    wallet: "",
    totalUsd: 0.0,
    items: [
      {
        address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        decimals: 6,
        balance: 0.0,
        uiAmount: 0.0,
        chainId: "solana",
        name: "USDC",
        symbol: "USDC",
        logoURI:
          "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
        priceUsd: 0.0,
        valueUsd: 0.0,
      } as TokenItem,
      {
        address: "So11111111111111111111111111111111111111111",
        decimals: 9,
        balance: 0.0,
        uiAmount: 0.0,
        chainId: "solana",
        name: "Solana",
        symbol: "SOL",
        logoURI:
          "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
        priceUsd: 0.0,
        valueUsd: 0.0,
      } as TokenItem,
      {
        address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
        decimals: 6,
        balance: 0.0,
        uiAmount: 0.0,
        chainId: "solana",
        name: "USDT",
        symbol: "USDT",
        logoURI: "https://raw.githubusercontent.com/Smaler1/coin/main/logo.png",
        priceUsd: 0.0,
        valueUsd: 0.0,
      } as TokenItem,
    ],
  });

  const [users, setUsers] = useState<LinkedAccountWithMetadata[]>([]);

  const updatePortfolio = async (user: User) => {
    if (user && user.wallet) {
      const latestPortfolio = await getWalletPortfolio(user.wallet.address);
      // let latestPortfolio = await getWalletPortfolio("4RetBVitL3h4V1YrGCJMhGbMNHRkhgnDCLuRjj8a9i1P");
      setPortfolio((_) => latestPortfolio);
    }
  };

  const updateUsersDb = async () => {
    const data = await axios.get(
      `${process.env.NEXT_KIWI_API_HOST}/privy/get-all-users`,
    );
    //@ts-ignore
    const linkedAccounts: LinkedAccountWithMetadata[] = data["linked_accounts"];
    setUsers((_) => linkedAccounts);
  };

  const value = {
    portfolio,
    users,
    updatePortfolio,
    updateUsersDb,
  } as WalletContextType;

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
