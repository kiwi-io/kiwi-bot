import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, createTransferCheckedInstruction, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import { NATIVE_SOL_PUBKEY } from '../../constants';

export interface TransferParams {
  connection: Connection;
  fromPubkey: PublicKey;
  toPubkey: PublicKey;
  token: PublicKey;
  tokenDecimals: number;
  amount: number;
}

export const getTransferTransaction = async ({
    connection,
    fromPubkey,
    toPubkey,
    token,
    tokenDecimals,
    amount
}: TransferParams): Promise<Transaction> => {
    if(token.equals(NATIVE_SOL_PUBKEY)) {
        console.log("Start preping tx: ", Date.now());
        const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey,
              toPubkey,
              lamports: amount,
            })
        );

        transaction.feePayer = fromPubkey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        console.log("ENd preping tx: ", Date.now());
          return transaction;
    }
    else {
        
        console.log("Fetching gATA: ", Date.now());
        const fromTokenAccount = await getAssociatedTokenAddress(token, fromPubkey, false);
        const toTokenAccount = await getAssociatedTokenAddress(token, toPubkey, false);

        console.log("fetching account infos: ", Date.now());
        const [tokenInfo, toTokenAccountInfo] = await connection.getMultipleAccountsInfo([
            token,
            toTokenAccount
        ]);

        let tokenOwnerProgram = TOKEN_PROGRAM_ID;

        if(tokenInfo.owner === TOKEN_2022_PROGRAM_ID) {
            tokenOwnerProgram = TOKEN_2022_PROGRAM_ID;
        }

        const transaction = new Transaction();

        if(!toTokenAccountInfo) {
            transaction.add(
                createAssociatedTokenAccountInstruction(
                    fromPubkey,
                    toTokenAccount,
                    toPubkey,
                    token,
                    tokenOwnerProgram
                )
            )
        }

        transaction.feePayer = fromPubkey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        console.log("User balance: ", (await connection.getTokenAccountBalance(fromTokenAccount)).value.uiAmount);
        console.log("amount transfer: ", amount);

        transaction.add(
            createTransferCheckedInstruction(
                fromTokenAccount,
                token,
                toTokenAccount,
                fromPubkey,
                amount,
                tokenDecimals,
                [],
                tokenOwnerProgram
            )
        );

        console.log("Transaction prepared: ", Date.now());
        
        return transaction;
    }
}