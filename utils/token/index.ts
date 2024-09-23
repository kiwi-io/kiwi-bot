import { Connection, PublicKey } from "@solana/web3.js"
import { SPL_TOKEN_PROGRAM, TOKEN_EXTENSIONS_PROGRAM } from "../../constants";
import { AccountLayout } from '@solana/spl-token';
import BN from 'bn.js';

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

        let tokenAccountBalances = allTokenAccounts.map((accountInfo) => {
            // Account data is in a Buffer format, we need to parse it
            const accountData = accountInfo.account.data;
            const parsedData = AccountLayout.decode(accountData);
      
            // The balance is stored as a u64 in the data
            //@ts-ignore
            const balance = new BN(parsedData.amount, 10, 'le'); 
      
            if(balance.gt(new BN(0))) {
                return {
                    pubkey: accountInfo.pubkey.toBase58(),
                    balance: balance.toString(),
                  };
            }
        });

        tokenAccountBalances = tokenAccountBalances.filter((item) => item != null && item !== undefined);
  
      console.log("tokenAccountBalances: ", tokenAccountBalances);
        
    } catch (error) {
        console.error("Error fetching token accounts:", error);
    }
    

}