import { User, WalletWithMetadata } from "@privy-io/react-auth";

export const hasExistingSolanaWallet = (user: User) => {
  let solanaWalletStatus = !!user.linkedAccounts.find(
    (account): account is WalletWithMetadata =>
      account.type === "wallet" &&
      account.walletClientType === "privy" &&
      account.chainType === "solana",
  );
  return solanaWalletStatus;
};
