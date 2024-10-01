import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountIdempotentInstruction, TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, createTransferCheckedInstruction, createTransferInstruction } from '@solana/spl-token';
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
        const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey,
              toPubkey,
              lamports: amount, // amount in lamports
            })
        );

        transaction.feePayer = fromPubkey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

          return transaction;
    }
    else {
        const tokenInfo = await connection.getAccountInfo(token);
        console.log("tokenInfo: ", tokenInfo);
        console.log("tokenOwnerProgram: ", tokenInfo.owner.toString());

        let tokenOwnerProgram = TOKEN_PROGRAM_ID;

        if(tokenInfo.owner === TOKEN_2022_PROGRAM_ID) {
            tokenOwnerProgram = TOKEN_2022_PROGRAM_ID;
        }

        console.log("tokenOwnerProgram after: ", tokenOwnerProgram);

        const fromTokenAccount = await getAssociatedTokenAddress(token, fromPubkey, false);
        const toTokenAccount = await getAssociatedTokenAddress(token, toPubkey, false);

        console.log("fromTokenAccount: ", fromTokenAccount.toString());
        console.log("toTokenAccount: ", toTokenAccount.toString());

        const transaction = new Transaction();

        transaction.feePayer = fromPubkey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        // transaction.add(
        //     createAssociatedTokenAccountIdempotentInstruction(
        //         fromPubkey,
        //         fromTokenAccount,
        //         fromPubkey,
        //         token,
        //     )
        // );

        // transaction.add(
        //     createAssociatedTokenAccountIdempotentInstruction(
        //         toPubkey,
        //         toTokenAccount,
        //         toPubkey,
        //         token,
        //     )
        // );

        // transaction.add(
        //     createTransferInstruction(
        //         fromTokenAccount,
        //         toTokenAccount,
        //         fromPubkey,
        //         amount,
        //         [],
        //     )
        // );
        
        return transaction;
    }
}