import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

const handler = async (_req: VercelRequest, res: VercelResponse) => {
  try {
    const response = await axios.get("https://auth.privy.io/api/v1/users", {
      headers: {
        Authorization: `Basic ${btoa(`${process.env.NEXT_PRIVY_APP_ID}:${process.env.NEXT_PRIVY_SECRET}`)}`,
        "privy-app-id": process.env.NEXT_PRIVY_APP_ID,
      },
    });

    const users = response.data.data;
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export default handler;
