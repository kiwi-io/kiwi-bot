import axios from "axios";
import {
  BIRDEYE_GET_TOKEN,
  BIRDEYE_GET_WALLET_PORTFOLIO,
} from "../../constants/urls";

export interface TokenItem {
  address: string;
  decimals: number;
  balance: number;
  uiAmount: number;
  chainId: string;
  name: string;
  symbol: string;
  logoURI: string;
  priceUsd: number;
  valueUsd: number;
}

export interface TokenData {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  extensions: string;
  logoURI: string;
  liquidity: number;
  price: number;
}

export interface WalletPortfolio {
  wallet: string;
  totalUsd: number;
  items: TokenItem[];
}

export const getWalletPortfolio = async (
  address: string,
): Promise<WalletPortfolio> => {
  try {
    const response = await axios.get(
      `${BIRDEYE_GET_WALLET_PORTFOLIO}${address}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": `${process.env.NEXT_BIRDEYE_API_KEY}`,
        },
      },
    );

    return response.data.data as WalletPortfolio;
  } catch (error) {
    console.error("Error fetching wallet portfolio:", error);
    return {
      wallet: "",
      totalUsd: 0,
      items: [],
    };
  }
};

export const getToken = async (token: string): Promise<TokenData> => {
  try {
    const response = await axios.get(`${BIRDEYE_GET_TOKEN}${token}`, {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": `${process.env.NEXT_BIRDEYE_API_KEY}`,
      },
    });

    return response.data.data as TokenData;
  } catch (error) {
    console.error("Error fetching wallet portfolio:", error);
    return undefined;
  }
};
