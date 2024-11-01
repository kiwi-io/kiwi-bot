import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  createTransferCheckedInstruction,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { NATIVE_SOL_PUBKEY } from "../../constants";
import { requestComputeUnitsInstructions } from "../solana";

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
  amount,
}: TransferParams): Promise<VersionedTransaction> => {
  const instructions: TransactionInstruction[] = [];

  instructions.push(...requestComputeUnitsInstructions(100, 200_000));

  const amountInLamports = amount * LAMPORTS_PER_SOL;

  if (token.equals(NATIVE_SOL_PUBKEY)) {
    instructions.push(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: amountInLamports,
      }),
    );

    const messageV0 = new TransactionMessage({
      payerKey: fromPubkey,
      recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
      instructions,
    }).compileToV0Message();

    const versionedTransaction = new VersionedTransaction(messageV0);

    return versionedTransaction;
  } else {
    let tokenInfo = await connection.getAccountInfo(token);

    let tokenOwnerProgram = TOKEN_PROGRAM_ID;
    if (tokenInfo.owner.toString() === TOKEN_2022_PROGRAM_ID.toString()) {
      tokenOwnerProgram = TOKEN_2022_PROGRAM_ID;
    }

    const fromTokenAccount = await getAssociatedTokenAddress(
      token,
      fromPubkey,
      false,
      tokenOwnerProgram,
    );
    const toTokenAccount = await getAssociatedTokenAddress(
      token,
      toPubkey,
      false,
      tokenOwnerProgram,
    );

    let toTokenAccountInfo = await connection.getAccountInfo(token);
    console.log("toTokenAccountInfo: ", toTokenAccountInfo);

    if (!toTokenAccountInfo) {
      console.log('Adding instruction createAta');
      instructions.push(
        createAssociatedTokenAccountInstruction(
          fromPubkey,
          toTokenAccount,
          toPubkey,
          token,
          tokenOwnerProgram,
        ),
      );
    }

    const amountInDecimals = amount * (10 ** tokenDecimals);
    console.log("amount: ", amount);
    console.log('tokenDecimals: ', tokenDecimals);
    console.log("amountInDecimals: ", amountInDecimals);

    instructions.push(
      createTransferCheckedInstruction(
        fromTokenAccount,
        token,
        toTokenAccount,
        fromPubkey,
        amountInDecimals,
        tokenDecimals,
        [],
        tokenOwnerProgram,
      ),
    );

    console.log("final ixs: ", instructions);

    const messageV0 = new TransactionMessage({
      payerKey: fromPubkey,
      recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
      instructions,
    }).compileToV0Message();

    const versionedTransaction = new VersionedTransaction(messageV0);

    return versionedTransaction;
  }
};
