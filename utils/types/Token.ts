export type Token = string;

export interface TokenInfo {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  logo: string;
  price: number;
}

export interface TokenWithBalance {
  tokenAccount: string;
  balance: string;
}
