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
      let getData: any;
      let keyboard = new InlineKeyboard();

      if(urlMatch[0].includes("jup") || urlMatch[0].includes("magiceden") || urlMatch[0].includes("underdog") || urlMatch[0].includes("tiplink")) {
        const url = new URL(urlMatch[0]);

        const actionsJsonResponse = await axios.get(`${url.origin}/actions.json`);
        const actionsJson = actionsJsonResponse.data as ActionsJsonConfig;
        const actionsUrlMapper = new ActionsURLMapper(actionsJson);
    
        let actionApiUrl = new URL(actionsUrlMapper.mapUrl(url));
        const getDataResponse = await axios.get(`${actionApiUrl}`);
        getData = getDataResponse.data;
    
        getData.links.actions.forEach((action: any) => {
          if(!action.parameters) {
            const inline_url = `https://t.me/samplekiwibot/bot?startapp=${encodeTelegramCompatibleURL(actionApiUrl.origin + action.href)}`;
            console.log("inline_url: ", inline_url);
            keyboard.url(action.label, inline_url).row();
          }
         });
      }
      else if(urlMatch[0].includes("drift") || urlMatch[0].includes("lulo")) {
        let actionApiUrl = new URL(urlMatch[0]);
        const getDataResponse = await axios.get(`${actionApiUrl}`);
        getData = getDataResponse.data;
          
        getData.links.actions.forEach((action: any) => {
          if(!action.parameters) {
            const inline_url = `https://t.me/samplekiwibot/bot?startapp=${encodeTelegramCompatibleURL(action.href)}`;
            keyboard.url(action.label, inline_url).row();
          }
         });

         if(urlMatch[0].includes("drift")) {
          for(let index = 1; index <= 3; index++) {
            const depositAmount = 50 * index;
            const inline_url = `https://t.me/samplekiwibot/bot?startapp=${encodeTelegramCompatibleURL(`://actions.drift.trade/transactions/deposit?token=USDC&amount=${depositAmount}`)}`;
            keyboard.url(`${depositAmount} USD`, inline_url).row();
          }  
         }
      }
      
      try {
        console.log("icon: ", getData.icon);
        await ctx.replyWithPhoto(getData.icon, {
          caption: `<b>${getData.title}</b>\n\n${trimString(getData.description)}`,
          parse_mode: "HTML",
          reply_markup: keyboard,
        });
      }
      catch(err) {
        console.log("Error sending photo response: ", err);
        await ctx.reply(`<b>${getData.title}</b>\n\n${trimString(getData.description)}`, {
          parse_mode: "HTML",
          reply_markup: keyboard,
        });
      }
  
    }
    catch(err) {
      console.log("Error overall: ", err);

      ctx.reply("Error generating a blink");
    }
  }
  else {
    ctx.reply("Invalid URL");
  }
});

// Inline query handler for URLs
bot.on("inline_query", async (ctx) => {
  const queryText = ctx.inlineQuery.query;

  if(queryText.startsWith("$")) {
    try {
      // Render jupiter swap flow
      const ticker = queryText.slice(1);
      let getData: any;
      let keyboard = new InlineKeyboard();

      const url = new URL(`https://jup.ag/swap/SOL-${ticker}`);

      const actionsJsonResponse = await axios.get(`${url.origin}/actions.json`);
      const actionsJson = actionsJsonResponse.data as ActionsJsonConfig;
      const actionsUrlMapper = new ActionsURLMapper(actionsJson);

      let actionApiUrl = new URL(actionsUrlMapper.mapUrl(url));
      const getDataResponse = await axios.get(`${actionApiUrl}`);
      getData = getDataResponse.data;

      getData.links.actions.forEach((action: any) => {
        if(!action.parameters) {
          const inline_url = `https://t.me/samplekiwibot/bot?startapp=jup-${encodeTelegramCompatibleURL(actionApiUrl.origin + action.href)}&mode=compact`;
          console.log("inline_url: ", inline_url);
          keyboard.url(action.label, inline_url).row();
        }
        });

      ctx.answerInlineQuery([
        {
          type: "photo",
          id: "1",
          photo_url: getData.icon,
          thumbnail_url: getData.icon,
          title: getData.title,
          description: getData.description,
          caption: getData.description,
          // input_message_content: {
          //   message_text: getData.title,
          // },
          parse_mode: "HTML",
          reply_markup: keyboard,
        },
      ]);
    }
    catch(err) {
      await ctx.answerInlineQuery([
        {
          type: "article",
          id: "1",
          title: `Error generating Jupiter blink`,
          description: `Error generating Jupiter blink`,
          input_message_content: {
            message_text: `Error generating Jupiter blink`,
          },
        },
      ]);
    } 
  }
  else if(queryText.startsWith("drift")) {
    try {
      let keyboard = new InlineKeyboard();
      const inline_url = `https://t.me/samplekiwibot/bot?startapp=${encodeTelegramCompatibleURL(`https://app.drift.trade/bet/TRUMP-WIN-2024-BET`)}`;

      keyboard.url(`TRUMP`, inline_url).row();
      keyboard.url(`HARRIS`, inline_url).row();

      ctx.answerInlineQuery([
        {
          type: "photo",
          id: "1",
          photo_url: `https://app.drift.trade/_next/image?url=https%3A%2F%2Fdrift-public.s3.eu-central-1.amazonaws.com%2Fprediction-markets%2Fmarkets%2FTRUMP-WIN-2024-BET.webp&w=3840&q=75`,
          thumbnail_url: `https://app.drift.trade/_next/image?url=https%3A%2F%2Fdrift-public.s3.eu-central-1.amazonaws.com%2Fprediction-markets%2Fmarkets%2FTRUMP-WIN-2024-BET.webp&w=3840&q=75`,
          title: `Will Donald Trump win the 2024 Presidential Election?`,
          description: `Will Donald Trump win the 2024 Presidential Election? Predict & Earn, powered by Drift`,
          caption: `Will Donald Trump win the 2024 Presidential Election? Predict & Earn, powered by Drift`,
          // input_message_content: {
          //   message_text: getData.title,
          // },
          parse_mode: "HTML",
          reply_markup: keyboard,
        },
      ]);
    }
    catch(err) {
      await ctx.answerInlineQuery([
        {
          type: "article",
          id: "1",
          title: `Error generating Drift blink`,
          description: `Error generating Drift blink`,
          input_message_content: {
            message_text: `Error generating Drift blink`,
          },
        },
      ]);
    } 
  }
  else if(queryText.startsWith("tip")) {
    try {
      // Render tiplink flow
      let getData: any;
      let keyboard = new InlineKeyboard();

      const url = new URL(`https://tiplink.io/blinks/donate?dest=3J1PbrQ1j56h9xuZD5AYEPEtmgBWqxihEV9EY3JFNznR`);

      const actionsJsonResponse = await axios.get(`${url.origin}/actions.json`);
      const actionsJson = actionsJsonResponse.data as ActionsJsonConfig;
      const actionsUrlMapper = new ActionsURLMapper(actionsJson);
  
      let actionApiUrl = new URL(actionsUrlMapper.mapUrl(url));
      const getDataResponse = await axios.get(`${actionApiUrl}`);
      getData = getDataResponse.data;

      console.log("actionApiUrl: ", actionApiUrl.toString());
  
      getData.links.actions.forEach((action: any) => {
        console.log("action: ", action);
        if(!action.parameters) {
          
          const inline_url = `https://t.me/samplekiwibot/bot?startapp=tip-${encodeTelegramCompatibleURL(action.label.split(" ")[0])}-${encodeTelegramCompatibleURL(actionApiUrl.origin + action.href)}`;
          console.log("inline_url: ", inline_url);
          keyboard.url(action.label, inline_url).row();
        }
        });

      ctx.answerInlineQuery([
        {
          type: "gif",
          id: "1",
          gif_url: getData.icon,
          thumbnail_url: getData.icon,
          title: getData.title,
          caption: `${getData.title}\n\n${getData.description}`,
          // input_message_content: {
          //   message_text: getData.title,
          // },
          parse_mode: "HTML",
          reply_markup: keyboard,
        },
      ]);
    }
    catch(err) {
      await ctx.answerInlineQuery([
        {
          type: "article",
          id: "1",
          title: `Error generating Tiplink blink`,
          description: `Error generating Tiplink blink`,
          input_message_content: {
            message_text: `Error generating Tiplink blink`,
          },
        },
      ]);
    } 
  }
  else {
    // Detect if the query contains a URL
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urlMatch = queryText.match(urlRegex);

    // If a url, a payment blink is expected
    if (urlMatch) {
      const url = urlMatch[0];

      const response: BeneficiaryParams = extractPaymentBeneficiaryFromUrl(url);
      
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
                `https://t.me/samplekiwibot/bot?startapp=${encodeURIComponent(`send-${response.address}-${response.token}-${parseInt(response.amount.toString())}`)}`,
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
  }
});

// Launch the bot
export const botWebhook = webhookCallback(bot, "next-js");
