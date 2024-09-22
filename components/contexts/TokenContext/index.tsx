import React from "react";
import { useState, createContext, useContext } from "react";
import { TokenInfo, Token } from "../../../utils";

interface TokenContextType {
    tokenInfos: Map<Token, TokenInfo>;
    updateTokenInfos: () => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const useTokenContext = () => {
    const context = useContext(TokenContext);
    if (!context) {
        throw new Error("useTokenContext must be used within a TokenContextProvider");
    }
    return context;
}

//@ts-ignore
export const TokenContextProvider = ({ children }) => {
    const [tokenInfos, setTokenInfos] = useState<Map<Token, TokenInfo>>(new Map<Token, TokenInfo>);

    const updateTokenInfos = async() => {
        setTokenInfos(_ => new Map<Token, TokenInfo>);
    }
 
    const value = {
        tokenInfos,
        updateTokenInfos
    }

    return (
        <TokenContext.Provider value={value}>
            {children}
        </TokenContext.Provider>
    )
}