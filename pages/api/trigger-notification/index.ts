import { Bot } from "grammy";
import { allowCors } from "../../../server/utils/cors";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

const handler = async (req: any, res: any) => {
  if (req.method === "POST") {
    const { userId, messageText } = req.body;

    if (!userId || !messageText) {
      return res
        .status(400)
        .json({ error: "userId and messageText are required" });
    }

    try {
      await bot.api.sendMessage(userId, messageText);
      return res
        .status(200)
        .json({ success: true, message: "Notification sent successfully!" });
    } catch (error) {
      console.error("Failed to send notification:", error);
      return res
        .status(500)
        .json({ success: false, error: "Failed to send notification" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default allowCors(handler);