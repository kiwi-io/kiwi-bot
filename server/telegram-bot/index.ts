import { Bot, InlineKeyboard } from "grammy";
import { webhookCallback } from "grammy";
import axios from "axios";

// Initialize the bot
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

// Inline query handler for URLs
bot.on("inline_query", async (ctx) => {
  const queryText = ctx.inlineQuery.query;
  const userId = ctx.from.id;

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

    let buyInlineUrl = `https://t.me/samplekiwibot/bot?startapp=buy-${address}-${userId}`;
    let sellInlineUrl = `https://t.me/samplekiwibot/bot?startapp=sell-${address}-${userId}`;
    keyboard.url(`BUY`, buyInlineUrl).row();
    keyboard.url(`SELL`, sellInlineUrl).row();

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
    const name = response.data.data["name"];
    const price = parseFloat(response.data.data["price"]).toFixed(6);
    const liquidity = parseFloat(response.data.data["liquidity"]).toFixed(2);
    const mc = parseFloat(response.data.data["mc"]).toFixed(2);
    const buyDaily = response.data.data["buy24h"];
    const sellDaily = response.data.data["sell24h"];
    const volumeDaily = parseFloat(response.data.data["v24hUSD"]).toFixed(2);
    const priceChangeDaily = parseFloat(response.data.data["priceChange24hPercent"]);
    const viewDaily = response.data.data["view24h"];

    ctx.answerInlineQuery([
      {
        type: "article",
        id: "1",
        title: `Trade ${symbol} with SOL using Kiwi`,
        description: `Trade ${symbol} with SOL using Kiwi`,
        input_message_content: {
          message_text:
          `<b>${symbol}</b> | <b>${name}</b>\n\n💰 $<b>${price}</b> | <b>${priceChangeDaily > 0 ? `+${priceChangeDaily.toFixed(2)}` : `-${priceChangeDaily.toFixed(2)}`}%</b>\n\n💎 MC: <b>${mc}</b>\n\n📊 Vol: <b>${volumeDaily}</b>\n\n💦 Liq: <b>${liquidity}</b>\n\n💲 Buys: <b>${buyDaily}</b> | Sells: <b>${sellDaily}</b>\n\n👁 Views: <b>${viewDaily}</b>`,
          parse_mode: "HTML",
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
        description: `Paste a token CA to refer trades. You earn 50% fees from all volume`,
        input_message_content: {
          message_text: `Error - Refer trades & earn 50% trading fees`,
        },
        thumbnail_url: `https://i.ibb.co/6vHYGBg/Kiwi-Logo.png`,
        thumbnail_height: 30,
        thumbnail_width: 30,
      },
    ]);

    return;
  }
});

// Launch the bot
export const botWebhook = webhookCallback(bot, "next-js");
