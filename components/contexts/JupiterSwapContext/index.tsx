import React from "react";
import { useState, createContext, useContext } from "react";
import { getToken, TokenData } from "../../../utils";

export type Side = "buy" | "sell";

interface JupiterSwapContextType {
  side: Side;
  token: string;
  tokenData: TokenData;
  referrer: string;
  actionHost: string;
  actionHostLogo: string;
  
  updateSide: (side: Side) => void;
  updateToken: (token: string) => Promise<void>;
  updateReferrer: (referrer: string) => void;
  updateActionHost: (actionHost: string) => void;
  updateActionHostLogo: (actionHostLogo: string) => void; 
}

const JupiterSwapContext = createContext<JupiterSwapContextType | undefined>(undefined);

export const useJupiterSwapContext = () => {
  const context = useContext(JupiterSwapContext);
  if (!context) {
    throw new Error(
      "useJupiterSwapContext must be used within a JupiterSwapContextProvider",
    );
  }
  return context;
};

//@ts-ignore
export const JupiterSwapContextProvider = ({ children }) => {

  const [side, setSide] = useState<Side>("buy");
  const [token, setToken] = useState<string>("");
  const [tokenData, setTokenData] = useState<TokenData>();
  const [referrer, setReferrer] = useState<string>("");
  const [actionHost, setActionHost] = useState<string>("");
  const [actionHostLogo, setActionHostLogo] = useState<string>("");

  const updateSide = (side: Side) => {
    setSide((_) => side);
  }

  const updateToken = async (token: string) => {
    try {
        const tokenDataRes = await getToken(token);
        setTokenData((_) => tokenDataRes);
    }
    catch(err) {
        console.log("Error getting token data: ", token);
        setTokenData((_) => null);
    }

    setToken((_) => token);
  }

  const updateReferrer = (referrer: string) => {
    setReferrer((_) => referrer);
  }

  const updateActionHost = (actionHost: string) => {
    setActionHost((_) => actionHost);
  }

  const updateActionHostLogo = (actionHostLogo: string) => {
    setActionHostLogo((_) => actionHostLogo);
  }

  const value = {
    side,
    token,
    tokenData,
    referrer,
    actionHost,
    actionHostLogo,
    updateSide,
    updateToken,
    updateReferrer,
    updateActionHost,
    updateActionHostLogo
  } as JupiterSwapContextType;

  return (
    <JupiterSwapContext.Provider value={value}>{children}</JupiterSwapContext.Provider>
  );
};
