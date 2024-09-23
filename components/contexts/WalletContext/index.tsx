import { User } from "@privy-io/react-auth";
import React from "react";
import { useState, createContext, useContext } from "react";
import { Token, TokenInfo, TokenWithBalance } from "../../../utils/types/Token";
import { getHoldings, getTokenList, getTokenPrice } from "../../../utils";
import { PublicKey } from "@solana/web3.js";

interface WalletContextType {
    user: User;
    tokenWithBalances: Map<Token, TokenWithBalance>;
    tokenInfos: Map<Token, TokenInfo>;
    updateUser: (user: User) => void;
    updateTokenBalances: () => void;
    updateTokenInfos: () => void;
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
    const [user, setUser] = useState<User | undefined>(undefined);
    const [tokenWithBalances, setTokenWithBalances] = useState<Map<Token, TokenWithBalance>>(new Map<Token, TokenWithBalance>);
    const [tokenInfos, setTokenInfos] = useState<Map<Token, TokenInfo>>(new Map<Token, TokenInfo>);

    const updateUser = (user: User) => {
        setUser(_ => user);
    }

    const updateTokenBalances = async() => {
        let latestHoldings = new Map<Token, TokenWithBalance>();

        if(user && user.wallet) {
            latestHoldings = await getHoldings(new PublicKey(user?.wallet?.address));
            console.log("Latest holdings: ", latestHoldings);
        }
        else {
            console.log("No user found in WalletContext while updating token balance");
        }

        setTokenWithBalances(_ => latestHoldings);
    }

    const updateTokenInfos = async() => {
        let tokenInfos = new Map<Token, TokenInfo>();

        const tokenList = await getTokenList();
        
        let tokenInfosArray = tokenList.map(async (token) => {
            if(tokenWithBalances.get((token.address))) {
                const tokenPrice = await getTokenPrice(token.address);
                return {
                    address: token.address,
                    decimals: token.decimals,
                    symbol: token.symbol,
                    name: token.name,
                    logo: token.logoURI,
                    price: tokenPrice.value,
                } as TokenInfo;
            }
        });

        console.log("Latest tokenInfosArray: ", tokenInfosArray);
    }

    const value = {
        user,
        tokenWithBalances,
        tokenInfos,
        updateUser,
        updateTokenBalances,
        updateTokenInfos
    } as WalletContextType;

    return (
        <WalletContext.Provider value = {value}>
            {children}
        </WalletContext.Provider>
    )
}