import axios from "axios";
import { BIRDEYE_GET_TOKEN_LIST } from "../../constants/urls";

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

export const getTokenList = async() => {
    try {
        const response = await axios.get(`${BIRDEYE_GET_TOKEN_LIST}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_BIRDEYE_API_KEY}`,
              },        
        });

        console.log("Response,data: ", response.data);

        return response.data.tokens as TokenListItem[];
    } catch (error) {
        console.error('Error fetching token list:', error);
    }    
}