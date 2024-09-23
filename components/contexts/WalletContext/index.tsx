import { User } from "@privy-io/react-auth";
import React from "react";
import { useState, createContext, useContext } from "react";
import { getWalletPortfolio, WalletPortfolio } from "../../../utils";

interface WalletContextType {
    portfolio: WalletPortfolio;
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
    const [portfolio, setPortfolio] = useState<WalletPortfolio>({
        wallet: "",
        totalUsd: 0,
        items: []
    });
    
    const updatePortfolio = async(user: User) => {
        if(user && user.wallet) {
            // const latestPortfolio = await getWalletPortfolio(user.wallet.address);
            const latestPortfolio = await getWalletPortfolio("4RetBVitL3h4V1YrGCJMhGbMNHRkhgnDCLuRjj8a9i1P");
            console.log("Latest portfolio: ", latestPortfolio);
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