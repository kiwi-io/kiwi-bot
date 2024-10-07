import { ComputeBudgetProgram, Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { NATIVE_SOL_PUBKEY } from "../../constants";
import { getTransferTransaction, TransferParams } from "../token";

export const requestComputeUnitsInstructions = (
    microLamportsPerCU: number,
    requestedUnits: number
): TransactionInstruction[] => {
    const computePriceIx = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: parseInt(microLamportsPerCU.toString()),
      });

      const computeLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
        units: requestedUnits,
      });
      
    return [
        computePriceIx,
        computeLimitIx
    ];
}

export const simulateTransaction = async () => {
  const connection = new Connection(process.env.NEXT_RPC_MAINNET_URL);

  const sender = new PublicKey("");
  const recipient = new PublicKey("");
  
  const transferParams = {
    connection,
    fromPubkey: sender,
    toPubkey: recipient,
    token: NATIVE_SOL_PUBKEY,
    tokenDecimals: 9,
    amount: 100
  } as TransferParams;

  const transferTransaction = await getTransferTransaction(transferParams);
  
  const results = await connection.simulateTransaction(transferTransaction);

  console.log("Results: ", results);
} 