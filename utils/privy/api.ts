import { LinkedAccountWithMetadata } from "@privy-io/server-auth";
import { getPrivyClient } from "./utils";

export const pregenerateWallet = async (username: string) => {
    try {
      const privy = getPrivyClient();

      const user = await privy.importUser({
          linkedAccounts: [
            {
              type: 'telegram',
              username
            } as LinkedAccountWithMetadata
          ],
          createEthereumWallet: false,
          createSolanaWallet: true,
        });

      console.log("Result: ", user);
      
      return user;
    }
    catch(err) {
      console.log("Error pregenerating wallet: ", err);
    }
}