import { Bot, InlineKeyboard } from "grammy";
import { webhookCallback } from "grammy";
import { BeneficiaryParams, encodeTelegramCompatibleURL, extractPaymentBeneficiaryFromUrl, trimString } from "./utils";
import axios from "axios";
import { type ActionsJsonConfig, ActionsURLMapper } from "@dialectlabs/blinks-core";

// Initialize the bot
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

bot.on("message", async (ctx) => {
  ctx.reply("Generating a blink, can take a few seconds");
  const message = ctx.message;

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urlMatch = message.text.match(urlRegex);

  if(urlMatch) {
    try {
      const url = new URL(urlMatch[0]);

      const actionsJsonResponse = await axios.get(`${url.origin}/actions.json`);
      const actionsJson = actionsJsonResponse.data as ActionsJsonConfig;
      const actionsUrlMapper = new ActionsURLMapper(actionsJson);
      const actionApiUrl = new URL(actionsUrlMapper.mapUrl(url));

      const getDataResponse = await axios.get(`${actionApiUrl}`);
      const getData = getDataResponse.data;

      const keyboard = new InlineKeyboard();

      getData.links.actions.forEach((action: any) => {
        if(!action.parameters) {
          const inline_url = `https://t.me/samplekiwibot/bot?startapp=${encodeTelegramCompatibleURL(actionApiUrl.origin + action.href)}`;
          console.log("inline_url: ", inline_url);
          keyboard.url(action.label, inline_url).row();
        }
       });
      
      try {
        await ctx.replyWithPhoto(getData.icon, {
          caption: `<b>${getData.title}</b>\n\n${trimString(getData.description)}`,
          parse_mode: "HTML",
          reply_markup: keyboard,
        });
      }
      catch(err) {
        await ctx.reply(`<b>${getData.title}</b>\n\n${trimString(getData.description)}`, {
          parse_mode: "HTML",
          reply_markup: keyboard,
        });
      }
  
    }
    catch(err) {
      console.log("Error: ", err);

      ctx.reply("Error generating a blink");
    }
  }
  else {
    ctx.reply("Invalid URL");
  }
});

// Inline query handler for URLs
// bot.on("inline_query", async (ctx) => {
//   const queryText = ctx.inlineQuery.query;

//   // Detect if the query contains a URL
//   const urlRegex = /(https?:\/\/[^\s]+)/g;
//   const urlMatch = queryText.match(urlRegex);

//   if (urlMatch) {
//     const url = urlMatch[0];

//     const response: BeneficiaryParams = extractPaymentBeneficiaryFromUrl(url);
    
//     if(response && response.address) {
//       await ctx.answerInlineQuery([
//         {
//           type: "article",
//           id: "1",
//           title: `Request a payment on Kiwi`,
//           description: `The received payment will be deposited on ` + (response ? `${response.username}'s Kiwi wallet. Click 'space' to activate.` : ``),
//           input_message_content: {
//             message_text: response ? `🧾 ${response.username} is requesting a payment of ${response.amount} ${response.token}` : `You are requested to make a payment using Kiwi`,
//           },
//           reply_markup: new InlineKeyboard()
//             .url(
//               "Pay using Kiwi",
//               `https://t.me/samplekiwibot/bot?startapp=${encodeURIComponent(`send-${response.address}-${response.token}-${parseInt(response.amount.toString())}`)}`,
//             )
//             .row()
//         },
//       ]);
//     }
//     else {
//     await ctx.answerInlineQuery([
//       {
//         type: "article",
//         id: "1",
//         title: `Request a payment on Kiwi`,
//         description: `The received payment will be deposited on your Kiwi account`,
//         input_message_content: {
//           message_text: `Send SOL & memecoins using Kiwi`,
//         },
//         reply_markup: new InlineKeyboard()
//           .url(
//             "Pay using Kiwi",
//             `https://t.me/samplekiwibot/bot?startapp=send`,
//           )
//           .row()
//       },
//     ]);
//     }
//   }
// });

// Launch the bot
export const botWebhook = webhookCallback(bot, "next-js");
