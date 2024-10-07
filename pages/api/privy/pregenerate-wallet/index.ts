// pages/api/index.ts
import { VercelRequest, VercelResponse } from "@vercel/node";
import { PrivyClient } from "@privy-io/server-auth";
import { LinkedAccountWithMetadata } from "@privy-io/server-auth";

const handler = async (
  req: VercelRequest,
  res: VercelResponse
) => {
    console.log("req: ", req);

    let username = "";

    try {
        username = req.query.username as string;
    }
    catch(err) {
        return res.status(500).json({ error: 'Invalid username passed' });
    }

    console.log("username: ", username);
  
    const privy = new PrivyClient(process.env.NEXT_PRIVY_APP_ID, process.env.NEXT_PRIVY_SECRET);

    try {
      console.log("in try");
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
    
        return res.status(200);
    }
    catch(err) {
        console.log("error aaya: ", err);
        return res.status(500).json(err);
    }
}

export default handler;