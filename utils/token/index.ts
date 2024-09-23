import { Connection, PublicKey } from "@solana/web3.js"
import { SPL_TOKEN_PROGRAM, TOKEN_EXTENSIONS_PROGRAM } from "../../constants";

export const getHoldings = async (address: PublicKey) => {
    //@ts-ignore
    const connection = new Connection(process.env.RPC_MAINNET);

    try {
        const splAccounts = (await connection.getTokenAccountsByOwner(
            address,
          { programId: SPL_TOKEN_PROGRAM }
        )).value.map((accountInfo) => {
            return {
                pubkey: accountInfo.pubkey.toBase58(),
                data: accountInfo.account.data
            }
        });
        
        const tokenExtensionAccounts = (await connection.getTokenAccountsByOwner(
            address,
          { programId: TOKEN_EXTENSIONS_PROGRAM }
        )).value.map((accountInfo) => {
            return {
                pubkey: accountInfo.pubkey.toBase58(),
                data: accountInfo.account.data
            }
        });
        
        console.log("SPL token accounts: ", splAccounts);
        console.log("Token extensions accounts: ", tokenExtensionAccounts);
        
    } catch (error) {
        console.error("Error fetching token accounts:", error);
    }
    

}