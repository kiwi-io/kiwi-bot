import axios from "axios";

export const getTelegramUserData = async (username: string) => {
  try {
    const response = await axios.get(
      `https://kiwi-bot.vercel.app/api/privy/get-telegram-userid?telegramUsername=${username}`,
    );
    return response.data[0];
  } catch (err) {
    console.log("Error fetching user data: ", err);
  }
};

export const triggerNotification = async (userId: string, messageText: string) => {
  try {
    const response = await axios.post("https://kiwi-bot.vercel.app/api/trigger-notification", {
      userId,
      messageText,
    });
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}