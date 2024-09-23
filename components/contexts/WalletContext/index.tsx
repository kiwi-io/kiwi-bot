import { User } from "@privy-io/react-auth";
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
            const before = Date.now();
            latestHoldings = await getHoldings(new PublicKey("4RetBVitL3h4V1YrGCJMhGbMNHRkhgnDCLuRjj8a9i1P"));
            const after = Date.now();
            console.log("getHoldings take: ", (after - before), "ms");
        }

        let tokenInfosMap = new Map<Token, TokenInfo>();
        let tokenList = await getTokenList();
        tokenList = tokenList.filter((token) => latestHoldings.get(token.address));
        console.log("Token list size after filter: ", tokenList);

        const before = Date.now();
        const tokenPricePromises = tokenList.map((token) => getTokenPrice(token.address));
        const tokenPrices = await Promise.all(tokenPricePromises);
        const after = Date.now();
        console.log("tokenPrices take: ", (after - before), "ms");

        for(let index = 0; index < tokenList.length; index++) {
            tokenInfosMap.set(
                tokenList[index].address,
                {
                    address: tokenList[index].address,
                    decimals: tokenList[index].decimals,
                    symbol: tokenList[index].symbol,
                    name: tokenList[index].name,
                    logo: tokenList[index].logoURI,
                    price: tokenPrices[index].value,
                } as TokenInfo
            )
        }

        setTokenWithBalances((_) => latestHoldings);
        setTokenInfos((_) => tokenInfosMap);
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