import bot from "../../server/telegram-bot";

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    await bot.handleUpdate(req.body); // Handle incoming Telegram updates
    res.status(200).send('OK');
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
