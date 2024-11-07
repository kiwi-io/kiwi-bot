import { AnchorProvider, Idl, Program, Wallet, web3 } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import idl from "./idl.json";
import { requestComputeUnitsInstructions } from "../solana";
import { createAssociatedTokenAccountIdempotentInstruction, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { WRAPPED_SOL_MAINNET } from "../../constants";
import { DAOS_CONFIG_ITEMS_LIST } from "./config";

export const fetchAllCurves = async() => {
    const connection = new web3.Connection(process.env.NEXT_RPC_MAINNET_URL);

    let privateKeyArray = JSON.parse(process.env.NEXT_PRIVATE_KEYPAIR);

    let traderKeypair = Keypair.fromSecretKey(
        Uint8Array.from(privateKeyArray),
    );

    // Create the provider using the wallet and connection
    const provider = new AnchorProvider(connection, new Wallet(traderKeypair), {
      commitment: "confirmed",
    });

  // Initialize the program using the IDL and the provider
  const program = new Program(idl as Idl, provider);

  //@ts-ignore
  const result = await program.account.curve.all();

  console.log("All accounts: ", result);
}

export const getDAOSTransaction = async(
  primaryIx: TransactionInstruction,
  wallet: PublicKey,
  tokenMint: PublicKey,
  signerTokenAta: PublicKey,
  signerFundingAta: PublicKey
): Promise<VersionedTransaction> => {
  const connection = new Connection(process.env.NEXT_RPC_MAINNET_URL);

  const configItem = DAOS_CONFIG_ITEMS_LIST.filter((i) => i.tokenMint === tokenMint.toString());
  const config = configItem[0];

  const instructions: TransactionInstruction[] = [
    ...requestComputeUnitsInstructions(100_000, 200_000),
    createAssociatedTokenAccountIdempotentInstruction(wallet, signerTokenAta, wallet, tokenMint, TOKEN_2022_PROGRAM_ID),
    createAssociatedTokenAccountIdempotentInstruction(wallet, signerFundingAta, wallet, new PublicKey(WRAPPED_SOL_MAINNET), TOKEN_PROGRAM_ID),
    createAssociatedTokenAccountIdempotentInstruction(wallet, new PublicKey(config.tokenVault), new PublicKey(config.curveAddress), tokenMint, TOKEN_2022_PROGRAM_ID),
    createAssociatedTokenAccountIdempotentInstruction(wallet, new PublicKey(config.fundingVault), new PublicKey(config.curveAddress), new PublicKey(WRAPPED_SOL_MAINNET), TOKEN_PROGRAM_ID),
    primaryIx
  ];

  const messageV0 = new TransactionMessage({
    payerKey: wallet,
    recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
    instructions,
  }).compileToV0Message();

  const versionedTransaction = new VersionedTransaction(messageV0);

  return versionedTransaction;
}