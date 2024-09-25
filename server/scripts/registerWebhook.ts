const setTelegramWebhook = async () => {
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setWebhook?url=https://kiwi-bot.vercel.app/api/telegram-bot`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: 'https://kiwi-bot.vercel.app/api/telegram-bot',
        }),
      }
    );
  
    const result = await response.json();
    console.log("Webhook registration url: ", result);
  };
  
  setTelegramWebhook();
  