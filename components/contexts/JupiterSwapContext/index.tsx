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
  updateTokenInData: (token: string | TokenData) => Promise<void>;
  updateTokenOut: (token: string) => Promise<void>;
  updateTokenOutData: (token: string | TokenData) => Promise<void>;
  updateQuantityIn: (quantity: string) => Promise<void>;
  updateQuantityOut: (quantity: string) => Promise<void>;
  updateReferrer: (referrer: string) => void;
  updateActionHost: (actionHost: string) => void;
  updateActionHostLogo: (actionHostLogo: string) => void;
}

const JupiterSwapContext = createContext<JupiterSwapContextType | undefined>(
  undefined,
);

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
  const [tokenIn, setTokenIn] = useState<string>("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
  const [tokenOut, setTokenOut] = useState<string>("So11111111111111111111111111111111111111112");
  const [quantityIn, setQuantityIn] = useState<string>("");
  const [quantityOut, setQuantityOut] = useState<string>("");

  const [tokenInData, setTokenInData] = useState<TokenData>({
    address: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`,
    decimals: 6,
    symbol: `USDC`,
    name: `USDC`,
    logoURI: `https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png`,
    liquidity: 0.0,
    price: 0.0,
  }  as TokenData);

  const [tokenOutData, setTokenOutData] = useState<TokenData>({
    address: `So11111111111111111111111111111111111111112`,
    decimals: 9,
    symbol: `SOL`,
    name: `Wrapped SOL`,
    logoURI: `https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png`,
    liquidity: 0.0,
    price: 0.0,
  } as TokenData);

  const [referrer, setReferrer] = useState<string>("");
  const [actionHost, setActionHost] = useState<string>("");
  const [actionHostLogo, setActionHostLogo] = useState<string>("");

  const updateSide = (side: Side) => {
    setSide((_) => side);
  };

  const updateTokenIn = async (token: string) => {
    setTokenIn((_) => token);
  };

  const updateTokenInData = async (token: string | TokenData) => {
    try {
      if(typeof token === 'string') {
        const tokenDataRes = await getToken(token);
        const td = {
          address: tokenDataRes["address"],
          decimals: tokenDataRes["decimals"],
          symbol: tokenDataRes["symbol"],
          name: tokenDataRes["name"],
          logoURI: tokenDataRes["logoURI"],
          liquidity: tokenDataRes["liquidity"],
          price: tokenDataRes["price"],
        } as TokenData;

        setTokenInData((_) => td);
      }
      else {
        setTokenInData((_) => token);
      }
    } catch (err) {
      console.log("Error getting tokenIn data: ", token);
      console.log("err: ", err);
      setTokenInData((_) => null);
    }
  };

  const updateTokenOut = async (token: string) => {
    setTokenOut((_) => token);
  };

  const updateTokenOutData = async (token: string | TokenData) => {
    try {
      if(typeof token === 'string') {
        const tokenDataRes = await getToken(token);

      const td = {
        address: tokenDataRes["address"],
        decimals: tokenDataRes["decimals"],
        symbol: tokenDataRes["symbol"],
        name: tokenDataRes["name"],
        logoURI: tokenDataRes["logoURI"],
        liquidity: tokenDataRes["liquidity"],
        price: tokenDataRes["price"],
      } as TokenData;

      setTokenOutData((_) => td);
      }
      else {
        setTokenOutData((_) => token);
      }
    } catch (err) {
      console.log("Error getting tokenIn data: ", token);
      console.log("err: ", err);
      setTokenOutData((_) => null);
    }
  };

  const updateQuantityIn = (quantity: string) => {
    setQuantityIn((_) => quantity);
  };

  const updateQuantityOut = (quantity: string) => {
    setQuantityOut((_) => quantity);
  };

  const updateReferrer = (referrer: string) => {
    setReferrer((_) => referrer);
  };

  const updateActionHost = (actionHost: string) => {
    setActionHost((_) => actionHost);
  };

  const updateActionHostLogo = (actionHostLogo: string) => {
    setActionHostLogo((_) => actionHostLogo);
  };

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
    updateActionHostLogo,
  } as JupiterSwapContextType;

  return (
    <JupiterSwapContext.Provider value={value}>
      {children}
    </JupiterSwapContext.Provider>
  );
};
