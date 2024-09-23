import axios from "axios";
import { BIRDEYE_GET_PRICE, BIRDEYE_GET_TOKEN_LIST } from "../../constants/urls";

export interface TokenListItem {
    address: string;
    decimals: number;
    lastTradeUnixTime: number;
    liquidity: number;
    logoURI: string;
    mc: number;
    name: string;
    symbol: string;
    v24hChangePercent: number;
    v24hUSD: number;
}

export interface TokenPriceItem {
    value: number;
    updateUnixTime: number;
    updateHumanTime: string;
}

export const getTokenList = async() => {
    try {
        const response = await axios.get(`${BIRDEYE_GET_TOKEN_LIST}`, {
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': `${process.env.NEXT_BIRDEYE_API_KEY}`,
              },        
        });

        console.log("Response aya getTokenList: ", response);

        return response.data.tokens as TokenListItem[];
    } catch (error) {
        console.error('Error fetching token list:', error);
        return [];
    }
}

export const getTokenPrice = async(address: string) => {
    try {
        console.log("URL: ", BIRDEYE_GET_PRICE + address);
        const response = await axios.get(`${BIRDEYE_GET_PRICE}${address}`, {
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': `${process.env.NEXT_BIRDEYE_API_KEY}`,
              },        
        });

        console.log("Get token price response: ", response);

        return response.data as TokenPriceItem;
    } catch (error) {
        console.error('Error fetching token list:', error);
    }
}