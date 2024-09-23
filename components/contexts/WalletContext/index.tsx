import { User } from "@privy-io/react-auth";
import React from "react";
import { useState, createContext, useContext } from "react";
import { getWalletPortfolio, TokenItem } from "../../../utils";

interface WalletContextType {
    portfolio: TokenItem[];
    updatePortfolio: (user: User) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWalletContext = () => {
    const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletContext must be used within a WalletContextProvider");
  }
  return context;
}

//@ts-ignore
export const WalletContextProvider = ({ children }) => {
    const [portfolio, setPortfolio] = useState<TokenItem[]>([]);
    
    const updatePortfolio = async(user: User) => {
        if(user && user.wallet) {
            const latestPortfolio = await getWalletPortfolio(user.wallet.address);
            setPortfolio((_) => latestPortfolio);
        }
    }

    const value = {
        portfolio,
        updatePortfolio
    } as WalletContextType;

    return (
        <WalletContext.Provider value = {value}>
            {children}
        </WalletContext.Provider>
    )
}