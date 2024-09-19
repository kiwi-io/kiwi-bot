import { User, WalletWithMetadata } from "@privy-io/react-auth";

export const hasExistingSolanaWallet = (user: User) => {
    let solanaWalletStatus = !!user.linkedAccounts.find(
        (account): account is WalletWithMetadata =>
        account.type === 'wallet' &&
        account.walletClientType === 'privy' &&
        account.chainType === 'solana',
    );
    if(solanaWalletStatus) {
        console.log(`User ${user.id} has a solana wallet`);
    }
    else {
        console.log(`User ${user.id} does not have a solana wallet`);
    }
    return solanaWalletStatus;
}