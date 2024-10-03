import { Bot, InlineKeyboard } from "grammy";
import { webhookCallback } from "grammy";
import { BeneficiaryParams, extractPaymentBeneficiaryFromUrl } from "./utils";

// Initialize the bot
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

bot.on("message", (ctx) => {
  const message = ctx.message;
  console.log("Message: ", message);
  ctx.reply(message.text);
});

// Inline query handler for URLs
bot.on("inline_query", async (ctx) => {
  const queryText = ctx.inlineQuery.query;

  // Detect if the query contains a URL
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urlMatch = queryText.match(urlRegex);

  if (urlMatch) {
    const url = urlMatch[0];

    const response: BeneficiaryParams = extractPaymentBeneficiaryFromUrl(url);
    
    if(response.username && response.address) {
      // Respond with a message that contains an image and buttons
      await ctx.answerInlineQuery([
        {
          type: "article",
          id: "1",
          title: `Request a payment on Kiwi`,
          description: `The received payment will be deposited on ${response.username}'s Kiwi wallet`,
          input_message_content: {
            message_text: `🧾 ${response.username} is requesting a payment of ${response.amount} ${response.token}`,
          },
          reply_markup: new InlineKeyboard()
            .url(
              "Pay using Kiwi",
              `https://t.me/samplekiwibot/bot?startapp=send-${response.address}-${response.token}-${response.amount}`,
            )
            .row()
        },
      ]);
    }
  } else {
    // If no URL is found, return a default message
    await ctx.answerInlineQuery([
      {
        type: "article",
        id: "2",
        title: "No URL found",
        input_message_content: {
          message_text: "Please tag a valid URL!",
        },
      },
    ]);
  }
});

// bot.on('inline_query', async (ctx) => {
//     const queryText = ctx.inlineQuery.query;
//     const urlRegex = /(https?:\/\/[^\s]+)/g;
//     const urlMatch = queryText.match(urlRegex);

//     if (urlMatch) {
//       const url = urlMatch[0];

//       // Respond with a custom image, message, and buttons
//       await ctx.answerInlineQuery([
//         {
//           type: 'photo',
//           id: '1',
//           photo_url: 'https://raw.githubusercontent.com/Smaler1/coin/main/logo.png', // Replace with your image URL
//           thumbnail_url: 'https://raw.githubusercontent.com/Smaler1/coin/main/logo.png', // Thumbnail
//           caption: `Custom message for ${url}`,
//           reply_markup: new InlineKeyboard()
//             .url('Open Kiwi App', `https://t.me/your_kiwi_bot?start=/rewards?text=unique_text_1`)
//             .row()
//             .url('Another Button', `https://t.me/your_kiwi_bot?start=/rewards?text=unique_text_2`),
//         },
//       ]);
//     } else {
//       await ctx.answerInlineQuery([
//         {
//           type: 'article',
//           id: '2',
//           title: 'No URL found',
//           input_message_content: {
//             message_text: 'Please tag a valid URL!',
//           },
//         },
//       ]);
//     }
//   });

// Launch the bot
export const botWebhook = webhookCallback(bot, "next-js");
