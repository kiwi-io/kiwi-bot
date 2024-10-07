import { Bot, InlineKeyboard } from "grammy";
import { webhookCallback } from "grammy";
import { BeneficiaryParams, extractPaymentBeneficiaryFromUrl } from "./utils";

// Initialize the bot
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

bot.on("message", (ctx) => {
  const message = ctx.message;

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urlMatch = message.text.match(urlRegex);

  if(urlMatch) {
    const url = urlMatch[0];

    ctx.reply(`You sent URL: ${url}`);
  }
  else {
    ctx.reply("Invalid URL");
  }
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
    
    console.log("URL: ", "https://worker.jup.ag/blinks/swap/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/So11111111111111111111111111111111111111112/0.5");
    console.log("Encoded url: ", encodeURIComponent("https://worker.jup.ag/blinks/swap/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/So11111111111111111111111111111111111111112/0.5"));

    if(response && response.address) {
      await ctx.answerInlineQuery([
        {
          type: "article",
          id: "1",
          title: `Request a payment on Kiwi`,
          description: `The received payment will be deposited on ` + (response ? `${response.username}'s Kiwi wallet. Click 'space' to activate.` : ``),
          input_message_content: {
            message_text: response ? `🧾 ${response.username} is requesting a payment of ${response.amount} ${response.token}` : `You are requested to make a payment using Kiwi`,
          },
          reply_markup: new InlineKeyboard()
            .url(
              "Pay using Kiwi",
              `https://t.me/samplekiwibot/bot?startapp=${encodeURIComponent(`https://worker.jup.ag/blinks/swap/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/So11111111111111111111111111111111111111112/0.5`)}`,
            )
            .row()
        },
      ]);
    }
    else {
    await ctx.answerInlineQuery([
      {
        type: "article",
        id: "1",
        title: `Request a payment on Kiwi`,
        description: `The received payment will be deposited on your Kiwi account`,
        input_message_content: {
          message_text: `Send SOL & memecoins using Kiwi`,
        },
        reply_markup: new InlineKeyboard()
          .url(
            "Pay using Kiwi",
            `https://t.me/samplekiwibot/bot?startapp=send`,
          )
          .row()
      },
    ]);
    }
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
