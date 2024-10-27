import React from "react";
import { useState, createContext, useContext } from "react";
import { getToken, TokenData } from "../../../utils";

export type Side = "buy" | "sell";

interface JupiterSwapContextType {
  side: Side;
  tokenIn: string;
  tokenOut: string;
  
  quantityIn: string;
  quantityOut: string;

  tokenInData: TokenData;
  tokenOutData: TokenData;

  referrer: string;
  actionHost: string;
  actionHostLogo: string;
  
  updateSide: (side: Side) => void;
  updateTokenIn: (token: string) => Promise<void>;
  updateTokenInData: (token: string) => Promise<void>;
  updateTokenOut: (token: string) => Promise<void>;
  updateTokenOutData: (token: string) => Promise<void>;
  updateQuantityIn: (quantity: string) => Promise<void>;
  updateQuantityOut: (quantity: string) => Promise<void>;
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
  const [tokenIn, setTokenIn] = useState<string>("");
  const [tokenOut, setTokenOut] = useState<string>("");
  const [quantityIn, setQuantityIn] = useState<string>("");
  const [quantityOut, setQuantityOut] = useState<string>("");
  const [tokenInData, setTokenInData] = useState<TokenData>();
  const [tokenOutData, setTokenOutData] = useState<TokenData>();
  const [referrer, setReferrer] = useState<string>("");
  const [actionHost, setActionHost] = useState<string>("");
  const [actionHostLogo, setActionHostLogo] = useState<string>("");

  const updateSide = (side: Side) => {
    setSide((_) => side);
  }

  const updateTokenIn = async (token: string) => {
    setTokenIn((_) => token);
  }

  const updateTokenInData = async (token: string) => {
    try {
        const tokenDataRes = await getToken(token);
        setTokenInData((_) => tokenDataRes);
        console.log("token in data is set: ", tokenInData);
    }
    catch(err) {
        console.log("Error getting tokenIn data: ", token);
        setTokenInData((_) => null);
    }
  }

  const updateTokenOut = async (token: string) => {
    setTokenOut((_) => token);
  }

  const updateTokenOutData = async (token: string) => {
    try {
        const tokenDataRes = await getToken(token);
        setTokenOutData((_) => tokenDataRes);
        console.log("token out data is set: ", tokenOutData);
    }
    catch(err) {
        console.log("Error getting tokenIn data: ", token);
        setTokenOutData((_) => null);
    }
  }

  const updateQuantityIn = (quantity: string) => {
    setQuantityIn((_) => quantity);
  }

  const updateQuantityOut = (quantity: string) => {
    setQuantityOut((_) => quantity);
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

    tokenIn,
    tokenOut,
    
    quantityIn,
    quantityOut,

    tokenInData,
    tokenOutData,

    referrer,
    actionHost,
    actionHostLogo,
    updateSide,
    updateTokenIn,
    updateTokenInData,
    updateTokenOut,
    updateTokenOutData,
    updateQuantityIn,
    updateQuantityOut,
    updateReferrer,
    updateActionHost,
    updateActionHostLogo
  } as JupiterSwapContextType;

  return (
    <JupiterSwapContext.Provider value={value}>{children}</JupiterSwapContext.Provider>
  );
};
