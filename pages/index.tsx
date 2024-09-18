import React from "react";
import { useEffect, useState } from "react";
  
export default function Home() {  

  const [telegramUser, setTelegramUser] = useState(null);

  useEffect(() => {
    //@ts-ignore
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      //@ts-ignore
      const webApp = window.Telegram.WebApp;

      // Initialize the Telegram Web App when the component loads
      webApp.ready();

      // Get and set user information
      setTelegramUser(webApp.initDataUnsafe.user);

      // Customize Web App appearance
      webApp.MainButton.setText('Start');
      webApp.MainButton.show();
    }
  }, []);


  return (
    <div>
        <h1>Hello world</h1>
        {
          telegramUser ? (
            <p>Welcome, {
              //@ts-ignore
              telegramUser.first_nam
            }!</p>
          ) : (
            <p>Loading Telegram User...</p>
          )
        }
    </div>
  );
}