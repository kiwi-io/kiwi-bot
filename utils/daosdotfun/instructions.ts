import * as anchor from "@coral-xyz/anchor";
import { Keypair, PublicKey, TransactionInstruction } from "@solana/web3.js";
import idl from "./idl.json";

export const DAOS_PROGRAM_ID = new PublicKey("5jnapfrAN47UYkLkEf7HnprPPBCQLvkYWGZDeKkaP5hv");

export async function createBuyTokenInstruction(
  accounts: {
    signer: PublicKey;
    depositor: PublicKey;
    tokenMint: PublicKey;
    fundingMint: PublicKey;
    signerTokenAta: PublicKey;
    signerFundingAta: PublicKey;
    curve: PublicKey;
    tokenVault: PublicKey;
    fundingVault: PublicKey;
    tokenProgram: PublicKey;
    fundingTokenProgram: PublicKey;
    associatedTokenProgram: PublicKey;
  },
  fundingAmount: anchor.BN,
  minTokenAmount: anchor.BN
): Promise<TransactionInstruction> {

    const connection = new anchor.web3.Connection(process.env.NEXT_RPC_MAINNET_URL);

    let privateKeyArray = JSON.parse(process.env.NEXT_PRIVATE_KEYPAIR);

    let traderKeypair = Keypair.fromSecretKey(
        Uint8Array.from(privateKeyArray),
    );

    // Create the provider using the wallet and connection
    const provider = new anchor.AnchorProvider(connection, new anchor.Wallet(traderKeypair), {
      commitment: "confirmed",
    });

  // Initialize the program using the IDL and the provider
  const program = new anchor.Program(idl as anchor.Idl, provider);

  // Construct the instruction using the program and the accounts
  return program.methods
    .buyToken(fundingAmount, minTokenAmount)
    .accounts({
      signer: accounts.signer,
      depositor: accounts.depositor,
      tokenMint: accounts.tokenMint,
      fundingMint: accounts.fundingMint,
      curve: accounts.curve,
      signerTokenAta: accounts.signerTokenAta,
      signerFundingAta: accounts.signerFundingAta,
      tokenVault: accounts.tokenVault,
      fundingVault: accounts.fundingVault,
      tokenProgram: accounts.tokenProgram,
      fundingTokenProgram: accounts.fundingTokenProgram,
      associatedTokenProgram: accounts.associatedTokenProgram,
    })
    .instruction();
}
