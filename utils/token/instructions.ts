import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, createTransferCheckedInstruction, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import { NATIVE_SOL_PUBKEY } from '../../constants';
import { requestComputeUnitsInstructions } from '../solana';

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
     
    const instructions: TransactionInstruction[] = [];

    // instructions.push(
    //     ...requestComputeUnitsInstructions(100, 200_000)
    // );

    if(token.equals(NATIVE_SOL_PUBKEY)) {
        instructions.push(
            SystemProgram.transfer({
              fromPubkey,
              toPubkey,
              lamports: amount,
            })
        );

        const transaction = new Transaction();
        
        for(let ix of instructions) {
            transaction.add(ix);
        }

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
        
        if(!toTokenAccountInfo) {
            instructions.push(
                createAssociatedTokenAccountInstruction(
                    fromPubkey,
                    toTokenAccount,
                    toPubkey,
                    token,
                    tokenOwnerProgram
                )
            )
        }


        instructions.push(
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

        const transaction = new Transaction();

        for(let ix of instructions) {
            transaction.add(ix);
        }

        transaction.feePayer = fromPubkey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        
        return transaction;
    }
}