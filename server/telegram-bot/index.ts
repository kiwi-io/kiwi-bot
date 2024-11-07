import { Bot, InlineKeyboard } from "grammy";
import { webhookCallback } from "grammy";
import axios from "axios";
import { formatWithCommas } from "../../utils";
import { formatNumberWithDenominations } from "./utils";
import { DAOS_CONFIG_ITEMS_LIST } from "../../utils/daosdotfun/config";

// Initialize the bot
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

bot.on("message", async (ctx) => {
  const queryText = ctx.message.text;
  const userId = ctx.from.id;

  try {
    // Render jupiter swap flow
    const address = queryText;
    let keyboard = new InlineKeyboard();

    let buyInlineUrl = `https://t.me/heykiwibot/kiwi?startapp=buy-${address}-${userId}`;
    let sellInlineUrl = `https://t.me/heykiwibot/kiwi?startapp=sell-${address}-${userId}`;
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

    const symbol = response.data.data["symbol"];
    const name = response.data.data["name"];
    const price = parseFloat(response.data.data["price"]).toFixed(6);
    const liquidity = formatNumberWithDenominations(
      parseFloat(response.data.data["liquidity"]),
    );
    const mc = formatNumberWithDenominations(
      parseFloat(response.data.data["mc"]),
    );
    const buyDaily = response.data.data["buy24h"];
    const sellDaily = response.data.data["sell24h"];
    const volumeDaily = formatNumberWithDenominations(
      parseFloat(response.data.data["v24hUSD"]),
    );
    const priceChangeDaily = parseFloat(
      response.data.data["priceChange24hPercent"],
    );
    const viewDaily = response.data.data["view24h"];

    await ctx.reply(
      `<b>${symbol}</b> | <b>${name}</b>\n\n💰 $<b>${price}</b> | <b>${priceChangeDaily > 0 ? `+${priceChangeDaily.toFixed(2)}` : `-${priceChangeDaily.toFixed(2)}`}%</b>\n\n💎 FDV: <b>${formatWithCommas(mc)}</b>\n\n📊 Vol: <b>${formatWithCommas(volumeDaily)}</b>\n\n💦 Liq: <b>${formatWithCommas(liquidity)}</b>\n\n💲 Buys: <b>${buyDaily}</b> | Sells: <b>${sellDaily}</b>\n\n👁 Views: <b>${viewDaily}</b>\n\n<code>${address}</code>`,
      {
        parse_mode: "HTML",
        reply_markup: keyboard,
      },
    );
  } catch (err) {
    await ctx.reply(`Token not found. Send a valid token CA`);

    return;
  }
});

// Inline query handler for Jupiter tokens via CA
bot.on("inline_query", async (ctx) => {
  const queryText = ctx.inlineQuery.query;
  const userId = ctx.from.id;

  if(queryText.startsWith("$")) {
    console.log("starts with $");
    const ticker = queryText.slice(1);
    console.log("ticker: ", ticker);

    const configItem = DAOS_CONFIG_ITEMS_LIST.filter((i) => i.ticker.toLowerCase() === ticker.toLowerCase());
    const config = configItem[0];
    console.log("config: ", config);

    try {
      const address = config.tokenMint;
      let keyboard = new InlineKeyboard();

      let buyInlineUrl = `https://t.me/heykiwibot/kiwi?startapp=daos-buy-${address}-${userId}`;
      let sellInlineUrl = `https://t.me/heykiwibot/kiwi?startapp=daos-sell-${address}-${userId}`;
      keyboard.url(`BUY`, buyInlineUrl).row();
      keyboard.url(`SELL`, sellInlineUrl).row();    

      ctx.answerInlineQuery([
        {
          type: "article",
          id: "1",
          title: `Trade ${config.ticker} with SOL using Kiwi`,
          description: `Trade ${config.ticker} with SOL using Kiwi`,
          input_message_content: {
            message_text: `Trade ${config.ticker} on DAOs.fun using Kiwi`,
            parse_mode: "HTML",
          },
          reply_markup: keyboard,
        },
      ]);
    } catch (err) {
      console.log("Error: ", err);
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
  }
  else {
    try {
      // Render jupiter swap flow
      const address = queryText;
      let keyboard = new InlineKeyboard();
  
      let buyInlineUrl = `https://t.me/heykiwibot/kiwi?startapp=buy-${address}-${userId}`;
      let sellInlineUrl = `https://t.me/heykiwibot/kiwi?startapp=sell-${address}-${userId}`;
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
      const liquidity = formatNumberWithDenominations(
        parseFloat(response.data.data["liquidity"]),
      );
      const mc = formatNumberWithDenominations(
        parseFloat(response.data.data["mc"]),
      );
      const buyDaily = response.data.data["buy24h"];
      const sellDaily = response.data.data["sell24h"];
      const volumeDaily = formatNumberWithDenominations(
        parseFloat(response.data.data["v24hUSD"]),
      );
      const priceChangeDaily = parseFloat(
        response.data.data["priceChange24hPercent"],
      );
      const viewDaily = response.data.data["view24h"];
  
      ctx.answerInlineQuery([
        {
          type: "article",
          id: "1",
          title: `Trade ${symbol} with SOL using Kiwi`,
          description: `Trade ${symbol} with SOL using Kiwi`,
          input_message_content: {
            message_text: `<b>${symbol}</b> | <b>${name}</b>\n\n💰 $<b>${price}</b> | <b>${priceChangeDaily > 0 ? `+${priceChangeDaily.toFixed(2)}` : `-${priceChangeDaily.toFixed(2)}`}%</b>\n\n💎 FDV: <b>${formatWithCommas(mc)}</b>\n\n📊 Vol: <b>${formatWithCommas(volumeDaily)}</b>\n\n💦 Liq: <b>${formatWithCommas(liquidity)}</b>\n\n💲 Buys: <b>${buyDaily}</b> | Sells: <b>${sellDaily}</b>\n\n👁 Views: <b>${viewDaily}</b>\n\n<code>${address}</code>`,
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
  }
});

// Launch the bot
export const botWebhook = webhookCallback(bot, "next-js");
