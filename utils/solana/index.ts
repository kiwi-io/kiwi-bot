import {
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  SimulateTransactionConfig,
  TransactionInstruction,
} from "@solana/web3.js";
import { NATIVE_SOL_PUBKEY } from "../../constants";
import { getTransferTransaction, TransferParams } from "../token";

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

  console.log("Results: ", results);
};
