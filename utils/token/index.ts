import { Connection, PublicKey } from "@solana/web3.js"
import { SPL_TOKEN_PROGRAM, TOKEN_EXTENSIONS_PROGRAM } from "../../constants";

export const getHoldings = async (address: PublicKey) => {
    console.log("process.env.rpc_mainnet: ", process.env.NEXT_RPC_MAINNET_URL);
    //@ts-ignore
    const connection = new Connection(process.env.NEXT_RPC_MAINNET_URL);

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