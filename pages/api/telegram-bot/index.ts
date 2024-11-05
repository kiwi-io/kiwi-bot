// import bot from "../../server/telegram-bot";
import { botWebhook } from "../../../server/telegram-bot";

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    try {
      await botWebhook(req, res); // Handle the webhook with the bot

      res.status(200).send("OK");
    } catch (err) {
      console.error("Error handling update:", err);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
