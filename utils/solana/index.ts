import {
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  SimulateTransactionConfig,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { NATIVE_SOL_PUBKEY, WRAPPED_SOL_MAINNET } from "../../constants";
import { getTransferTransaction, TransferParams } from "../token";
import { createCloseAccountInstruction, createSyncNativeInstruction, getAssociatedTokenAddress, syncNative } from "@solana/spl-token";

export const requestComputeUnitsInstructions = (
  microLamportsPerCU: number,
  requestedUnits: number,
): TransactionInstruction[] => {
  const computePriceIx = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: parseInt(microLamportsPerCU.toString()),
  });

  const computeLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
    units: requestedUnits,
  });

  return [computePriceIx, computeLimitIx];
};

export const simulateTransaction = async () => {
  const connection = new Connection(process.env.NEXT_RPC_MAINNET_URL);

  const sender = new PublicKey("9Z4F1spoXmrWbWH4RyC33y71nRHz91WWRQBefMvr3t4L");
  const recipient = new PublicKey(
    "4RetBVitL3h4V1YrGCJMhGbMNHRkhgnDCLuRjj8a9i1P",
  );

  const transferParams = {
    connection,
    fromPubkey: sender,
    toPubkey: recipient,
    token: NATIVE_SOL_PUBKEY,
    tokenDecimals: 9,
    amount: 0.01,
  } as TransferParams;

  const transferTransaction = await getTransferTransaction(transferParams);

  const results = await connection.simulateTransaction(transferTransaction, {
    accounts: {
      encoding: "base64",
      addresses: transferTransaction.message.staticAccountKeys.map((i) =>
        i.toString(),
      ),
    },
  } as SimulateTransactionConfig);

  return results;
};

export const createWrappedSOLInstructions = async(
  owner: PublicKey,
  amount: number,
): Promise<{ wrapSolInstructions: TransactionInstruction[], unwrapSolInstruction: TransactionInstruction }> => {
  // Create the wrapped SOL associated token account for the payer
  const wrappedSolAccount = await getAssociatedTokenAddress(new PublicKey(WRAPPED_SOL_MAINNET), owner);
  
  // Instruction to create the associated token account for WSOL
  const wrapSolInstructions = [
    SystemProgram.transfer({
      fromPubkey: owner,
      toPubkey: wrappedSolAccount,
      lamports: amount,
    }),
    // Set account to be rent-exempt by synchronizing its balance
    createSyncNativeInstruction(wrappedSolAccount)
  ];

  // Instruction to close the WSOL account (unwrap SOL)
  const unwrapSolInstruction = createCloseAccountInstruction(
    wrappedSolAccount,
    owner,
    owner,
  );

  return { wrapSolInstructions, unwrapSolInstruction };
}

