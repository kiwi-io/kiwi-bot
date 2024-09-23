import { usePrivy, User } from "@privy-io/react-auth";
import React from "react";
import { useState, createContext, useContext } from "react";
import { Token, TokenInfo, TokenWithBalance } from "../../../utils/types/Token";
import { getHoldings, getTokenList, getTokenPrice } from "../../../utils";
import { PublicKey } from "@solana/web3.js";

interface WalletContextType {
    tokenWithBalances: Map<Token, TokenWithBalance>;
    tokenInfos: Map<Token, TokenInfo>;
    updateTokenBalancesAndInfos: (user: User) => void;
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
    const [tokenWithBalances, setTokenWithBalances] = useState<Map<Token, TokenWithBalance>>(new Map<Token, TokenWithBalance>);
    const [tokenInfos, setTokenInfos] = useState<Map<Token, TokenInfo>>(new Map<Token, TokenInfo>);

    const updateTokenBalancesAndInfos = async(user: User) => {
        let latestHoldings = new Map<Token, TokenWithBalance>();

        if(user && user.wallet) {
            // latestHoldings = await getHoldings(new PublicKey(user?.wallet?.address));
            latestHoldings = await getHoldings(new PublicKey("4RetBVitL3h4V1YrGCJMhGbMNHRkhgnDCLuRjj8a9i1P"));
            console.log("Latest holdings before update: ", latestHoldings);
        }

        setTokenWithBalances((_) => latestHoldings);

        let tokenInfos = new Map<Token, TokenInfo>();

        const tokenList = await getTokenList();
        console.log("Token List: ", tokenList);
        console.log("latest holdings in updateTokenInfos: ", tokenWithBalances);

        let tokenInfosArray: TokenInfo[] = [];

        tokenList.forEach(async (token) => {
            if(tokenWithBalances.get((token.address))) {
                const tokenPrice = await getTokenPrice(token.address);
                tokenInfosArray.push(
                    {
                        address: token.address,
                        decimals: token.decimals,
                        symbol: token.symbol,
                        name: token.name,
                        logo: token.logoURI,
                        price: tokenPrice.value,
                    } as TokenInfo
                );
            }
        });

        console.log("Latest tokenInfosArray: ", tokenInfosArray);

    }

    const value = {
        tokenWithBalances,
        tokenInfos,
        updateTokenBalancesAndInfos
    } as WalletContextType;

    return (
        <WalletContext.Provider value = {value}>
            {children}
        </WalletContext.Provider>
    )
}