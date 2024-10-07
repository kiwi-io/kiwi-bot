import { User, WalletWithMetadata } from "@privy-io/react-auth";
import { PrivyClient } from "@privy-io/server-auth";

export const hasExistingSolanaWallet = (user: User) => {
  let solanaWalletStatus = !!user.linkedAccounts.find(
    (account): account is WalletWithMetadata =>
      account.type === "wallet" &&
      account.walletClientType === "privy" &&
      account.chainType === "solana",
  );
  return solanaWalletStatus;
};

export const getPrivyClient = () => {
    const privy = new PrivyClient(process.env.NEXT_PRIVY_APP_ID, process.env.NEXT_PRIVY_SECRET);

    return privy;
}