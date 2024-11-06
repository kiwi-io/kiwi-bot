import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
import { allowCors } from "../../../../server/utils/cors";

const handler = async (req: VercelRequest, res: VercelResponse) => {
  try {
    let telegramUsername = "";

    try {
      telegramUsername = req.query.telegramUsername as string;
    } catch (err) {
      return res.status(500).json({ error: "Invalid parameters passed" });
    }

    const response = await axios.get("https://auth.privy.io/api/v1/users", {
      headers: {
        Authorization: `Basic ${btoa(`${process.env.NEXT_PRIVY_APP_ID}:${process.env.NEXT_PRIVY_SECRET}`)}`,
        "privy-app-id": process.env.NEXT_PRIVY_APP_ID,
      },
    });

    const users = response.data.data;

    const targetUser = users.filter(
      (ob: any) =>
        ob["linked_accounts"][0]["telegram_user_id"] === telegramUsername,
    );

    return res.status(200).json(targetUser);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export default handler;
