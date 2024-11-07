import * as anchor from "@coral-xyz/anchor";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import idl from "./idl.json";
import { DAOS_CONFIG_ITEMS_LIST } from "./config";
import { WRAPPED_SOL_MAINNET } from "../../constants";

export const DAOS_PROGRAM_ID = new PublicKey("5jnapfrAN47UYkLkEf7HnprPPBCQLvkYWGZDeKkaP5hv");

export async function createBuyTokenInstruction(
  accounts: {
    signer: PublicKey;
    tokenMint: PublicKey;
    signerTokenAta: PublicKey;
    signerFundingAta: PublicKey;
  },
  fundingAmount: anchor.BN,
  minTokenAmount: anchor.BN
): Promise<TransactionInstruction> {

    const connection = new anchor.web3.Connection(process.env.NEXT_RPC_MAINNET_URL);

    const provider = new anchor.AnchorProvider(connection, {} as anchor.Wallet, {
      commitment: "confirmed",
    });

  const program = new anchor.Program(idl as anchor.Idl, provider);

  const configItem = DAOS_CONFIG_ITEMS_LIST.filter((i) => i.tokenMint === accounts.tokenMint.toString());

  if(configItem.length > 0) {
    const config = configItem[0];

    const fundingMint = new PublicKey(WRAPPED_SOL_MAINNET);

    return program.methods
    .buyToken(fundingAmount, minTokenAmount)
    .accounts({
      signer: accounts.signer,
      depositor: config.depositor,
      tokenMint: accounts.tokenMint,
      fundingMint: fundingMint,
      curve: config.curveAddress,
      signerTokenAta: accounts.signerTokenAta,
      signerFundingAta: accounts.signerFundingAta,
      tokenVault: config.tokenVault,
      fundingVault: config.fundingVault,
      tokenProgram: config.tokenProgram,
      fundingTokenProgram: config.fundingTokenProgram,
      associatedTokenProgram: config.associatedTokenProgram,
    })
    .instruction();
  }
  else {
    return null;
  }
}
