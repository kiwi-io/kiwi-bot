import bot from "../../server/telegram-bot";

// export default async function handler(req: any, res: any) {
//   if (req.method === 'POST') {
//     await bot.handleUpdate(req.body); // Handle incoming Telegram updates
//     res.status(200).send('OK');
//   } else {
//     res.status(405).end(); // Method Not Allowed
//   }
// }

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    try {
      // Initialize the bot
      if (!bot.isInited()) {
        await bot.init(); // Fetch bot info from Telegram API
      }

      // Handle incoming Telegram updates
      await bot.handleUpdate(req.body); 

      res.status(200).send('OK');
    } catch (err) {
      console.error('Error handling update:', err);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
