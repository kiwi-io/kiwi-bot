export type Token = string;

export interface TokenInfo {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  logo: string;
  price: number;
  history30minPrice: number;
  priceChange30mPercent: number;
}

export interface TokenWithBalance {
  address: string;
  balance: number;
}