import { AnchorProvider, Idl, Program, Wallet, web3 } from "@coral-xyz/anchor";
import { Keypair } from "@solana/web3.js";
import idl from "./idl.json";

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