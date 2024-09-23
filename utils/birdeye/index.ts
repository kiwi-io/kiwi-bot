import axios from "axios";
import { BIRDEYE_GET_WALLET_PORTFOLIO } from "../../constants/urls";


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

export const getWalletPortfolio = async(address: string): Promise<TokenItem[]> => {
    try {
        const response = await axios.get(`${BIRDEYE_GET_WALLET_PORTFOLIO}${address}`, {
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': `${process.env.NEXT_BIRDEYE_API_KEY}`,
              },        
        });

        return response.data.data.items as TokenItem[];
    } catch (error) {
        console.error('Error fetching wallet portfolio:', error);
        return [];
    }
}