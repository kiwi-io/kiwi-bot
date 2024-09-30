import { User } from "@privy-io/react-auth";
import React from "react";
import { useState, createContext, useContext } from "react";
import { getWalletPortfolio, TokenItem, WalletPortfolio } from "../../../utils";

interface SendContextType {
    portfolio: WalletPortfolio;
    updatePortfolio: (user: User) => void;
}

const SendContext = createContext<SendContextType | undefined>(undefined);

export const useSendContext = () => {
    const context = useContext(SendContext);
  if (!context) {
    throw new Error("useSendContext must be used within a SendContextProvider");
  }
  return context;
}

//@ts-ignore
export const SendContextProvider = ({ children }) => {
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
                logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
                priceUsd: 0.0,
                valueUsd: 0.0,
            } as TokenItem,
            {
                address: "",
                decimals: 9,
                balance: 0.0,
                uiAmount: 0.0,
                chainId: "solana",
                name: "Solana",
                symbol: "SOL",
                logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
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
            } as TokenItem
        ]
    });
    
    const updatePortfolio = async(user: User) => {
        if(user && user.wallet) {
            const latestPortfolio = await getWalletPortfolio(user.wallet.address);
            // let latestPortfolio = await getWalletPortfolio("4RetBVitL3h4V1YrGCJMhGbMNHRkhgnDCLuRjj8a9i1P");
            console.log("Latest portfolio: ", latestPortfolio, " on: ", Date.now());
            setPortfolio((_) => latestPortfolio);
        }
    }

    const value = {
        portfolio,
        updatePortfolio
    } as SendContextType;

    return (
        <SendContext.Provider value = {value}>
            {children}
        </SendContext.Provider>
    )
}