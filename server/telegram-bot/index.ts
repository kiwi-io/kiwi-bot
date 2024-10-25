import { Bot, InlineKeyboard } from "grammy";
import { webhookCallback } from "grammy";
import axios from "axios";

// Initialize the bot
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

// Inline query handler for URLs
bot.on("inline_query", async (ctx) => {
  const queryText = ctx.inlineQuery.query;

  try {
    // Render jupiter swap flow
    const address = queryText;
    let keyboard = new InlineKeyboard();

    // let getData: any;

    // const url = new URL(`https://jup.ag/swap/SOL-${ticker}`);

    // const actionsJsonResponse = await axios.get(`${url.origin}/actions.json`);
    // const actionsJson = actionsJsonResponse.data as ActionsJsonConfig;
    // const actionsUrlMapper = new ActionsURLMapper(actionsJson);

    // let actionApiUrl = new URL(actionsUrlMapper.mapUrl(url));
    // const getDataResponse = await axios.get(`${actionApiUrl}`);
    // getData = getDataResponse.data;

    // getData.links.actions.forEach((action: any) => {
    //   if (!action.parameters) {
        // const inline_url = `https://t.me/samplekiwibot/bot?startapp=jup-${encodeTelegramCompatibleURL(actionApiUrl.origin + action.href)}&mode=compact`;
        // console.log("inline_url: ", inline_url);
        // keyboard.url(action.label, inline_url).row();
    //   }
    // });

    let inline_url = `https://t.me/samplekiwibot/bot?mode=compact`;
    keyboard.url(`BUY`, inline_url).row();
    keyboard.url(`SELL`, inline_url).row();


    const response = await axios.get(
      `https://public-api.birdeye.so/defi/token_overview?address=${address}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": `${process.env.NEXT_BIRDEYE_API_KEY}`,
        },
      },
    );

    const logoUri = response.data.data["logoURI"];
    const symbol = response.data.data["symbol"];

    // ctx.answerInlineQuery([
    //   {
    //     type: "photo",
    //     id: "1",
    //     photo_url: logoUri,
    //     thumbnail_url: logoUri,
    //     title: `Title - Trade ${symbol} with SOL using Kiwi`,
    //     description: `Description - Trade ${symbol} with SOL using Kiwi`,
    //     caption: `Caption - Trade ${symbol} with SOL using Kiwi`,
    //     parse_mode: "HTML",
    //     reply_markup: keyboard,
    //   },
    // ]);

    ctx.answerInlineQuery([
      {
        type: "article",
        id: "1",
        title: `Trade ${symbol} with SOL using Kiwi`,
        description: `Trade ${symbol} with SOL using Kiwi`,
        input_message_content: {
          message_text: `InputMessageContext - Trade ${symbol} with SOL using Kiwi`,
          parse_mode: "HTML"
        },
        thumbnail_url: logoUri,
        reply_markup: keyboard,
      },
    ]);
  } catch (err) {
    await ctx.answerInlineQuery([
      {
        type: "article",
        id: "1",
        title: `Refer trades & earn 50% trading fees`,
        description: `Paste a token CA and refer trades to your community. You earn 50% trading fees from all volume you generate`,
        input_message_content: {
          message_text: `Error - Refer trades & earn 50% trading fees`,
        },
      },
    ]);

    return;
  }
});

// Launch the bot
export const botWebhook = webhookCallback(bot, "next-js");
