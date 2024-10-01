import { Connection, PublicKey } from "@solana/web3.js";
import { SPL_TOKEN_PROGRAM, TOKEN_EXTENSIONS_PROGRAM } from "../../constants";
import { AccountLayout } from "@solana/spl-token";
import BN from "bn.js";
import { TokenWithBalance, Token } from "../types";

export * from "./instructions";

export const getHoldings = async (
  address: PublicKey,
): Promise<Map<Token, TokenWithBalance> | undefined> => {
  console.log("process.env.rpc_mainnet: ", process.env.NEXT_RPC_MAINNET_URL);
  //@ts-ignore
  const connection = new Connection(process.env.NEXT_RPC_MAINNET_URL);

  try {
    const [splTokenAccounts, token2022Accounts] = await Promise.all([
      connection.getTokenAccountsByOwner(address, {
        programId: SPL_TOKEN_PROGRAM,
      }),
      connection.getTokenAccountsByOwner(address, {
        programId: TOKEN_EXTENSIONS_PROGRAM,
      }),
    ]);

    const allTokenAccounts = [
      ...splTokenAccounts.value,
      ...token2022Accounts.value,
    ];

    const resultMap = new Map<Token, TokenWithBalance>();

    allTokenAccounts.map((accountInfo) => {
      // Account data is in a Buffer format, we need to parse it
      const accountData = accountInfo.account.data;
      const parsedData = AccountLayout.decode(accountData);

      // The balance is stored as a u64 in the data
      //@ts-ignore
      const balance = new BN(parsedData.amount, 10, "le");

      const mintPubkey = new PublicKey(parsedData.mint).toBase58();

      if (balance.gt(new BN(1))) {
        resultMap.set(mintPubkey.toString(), {
          tokenAccount: accountInfo.pubkey.toString(),
          balance: balance.toString(),
        } as TokenWithBalance);
      }
    });

    return resultMap;
  } catch (error) {
    console.error("Error fetching token accounts:", error);
  }
};
