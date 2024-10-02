import { ComputeBudgetProgram, TransactionInstruction } from "@solana/web3.js";

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