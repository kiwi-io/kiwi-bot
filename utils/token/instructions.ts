import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, TransactionInstruction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
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
}: TransferParams): Promise<VersionedTransaction> => {
     
    const instructions: TransactionInstruction[] = [];

    instructions.push(
        ...requestComputeUnitsInstructions(100, 200_000)
    );

    const amountInLamports = amount * LAMPORTS_PER_SOL;

    if(token.equals(NATIVE_SOL_PUBKEY)) {
        instructions.push(
            SystemProgram.transfer({
              fromPubkey,
              toPubkey,
              lamports: amountInLamports
            })
        );

        const messageV0 = new TransactionMessage({
            payerKey: fromPubkey,
            recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
            instructions,
        }).compileToV0Message();

        const versionedTransaction = new VersionedTransaction(messageV0);

          return versionedTransaction;
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
        console.log("TokenOwnerProgram: ", tokenOwnerProgram.toString());
        
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
                amount * (10 ** tokenDecimals),
                tokenDecimals,
                [],
                tokenOwnerProgram
            )
        );

        const messageV0 = new TransactionMessage({
            payerKey: fromPubkey,
            recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
            instructions,
        }).compileToV0Message();

        const versionedTransaction = new VersionedTransaction(messageV0);
        
        return versionedTransaction;
    }
}