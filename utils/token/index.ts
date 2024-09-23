import { Connection, PublicKey } from "@solana/web3.js"
import { SPL_TOKEN_PROGRAM, TOKEN_EXTENSIONS_PROGRAM } from "../../constants";

export const getHoldings = async (address: PublicKey) => {
    console.log("process.env.rpc_mainnet: ", process.env.NEXT_RPC_MAINNET_URL);
    //@ts-ignore
    const connection = new Connection(process.env.NEXT_RPC_MAINNET_URL);

    try {
        const [splTokenAccounts, token2022Accounts] = await Promise.all([
            connection.getTokenAccountsByOwner(address, { programId: SPL_TOKEN_PROGRAM }),
            connection.getTokenAccountsByOwner(address, { programId: TOKEN_EXTENSIONS_PROGRAM }),
        ]);
        
        const allTokenAccounts = [...splTokenAccounts.value, ...token2022Accounts.value];

        const tokenAccountBalances = await Promise.all(
            allTokenAccounts.map(async (accountInfo) => {
            const balance = await connection.getTokenAccountBalance(accountInfo.pubkey);
            return {
                pubkey: accountInfo.pubkey.toBase58(),
                balance: balance.value.uiAmountString,
            };
            })
      );
  
      console.log("tokenAccountBalances: ", tokenAccountBalances);
        
    } catch (error) {
        console.error("Error fetching token accounts:", error);
    }
    

}