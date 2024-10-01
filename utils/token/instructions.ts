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
        const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey,
              toPubkey,
              lamports: amount,
            })
        );

        transaction.feePayer = fromPubkey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

          return transaction;
    }
    else {
        
        const fromTokenAccount = await getAssociatedTokenAddress(token, fromPubkey, false);
        const toTokenAccount = await getAssociatedTokenAddress(token, toPubkey, false);

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
        
        return transaction;
    }
}