import axios from "axios";
import {
  BIRDEYE_GET_TOKEN,
  BIRDEYE_GET_WALLET_PORTFOLIO,
  BIRDEYE_GET_WALLET_TX_HISTORY,
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

export interface TransferLog {
  amount: number,
  symbol: string,
  name: string,
  decimals: number,
  address: string,
  logoURI: string,

  owner?: string,
  programId?: string,
  tokenAccount?: string
}

export interface ContractLabel {
  address: string,
  name: string,
  metadata: any
}

export interface TransactionHistory {
  txHash: string,
  blockNumber: number,
  blockTime: string,
  status: boolean,
  from: string,
  to: string,
  fee: number,
  mainAction: string,
  balanceChange: TransferLog[],
  contractLabel: ContractLabel
}

export interface TokenData {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
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

export const getWalletTransactionHistory = async (
  address: string
): Promise<TransactionHistory[]> => {
  try {
    const response = await axios.get(
      `${BIRDEYE_GET_WALLET_TX_HISTORY}${address}&limit=50`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": `${process.env.NEXT_BIRDEYE_API_KEY}`,
        },
      },
    );

    return response.data.data["solana"] as TransactionHistory[];
  } catch (error) {
    console.error("Error fetching wallet portfolio:", error);
    return [];
  }
}

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
