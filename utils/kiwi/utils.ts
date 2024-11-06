import axios from "axios";

export const getTelegramUserData = async (username: string) => {
  try {
    const response = await axios.get(
      `https://heykiwi.io/api/privy/get-telegram-userid?telegramUsername=${username}`
    );
    return response.data[0];
  } catch (err) {
    console.log("Error fetching user data: ", err);
  }
};

export const triggerNotification = async (
  userId: string,
  messageText: string,
) => {
  try {
    const response = await axios.post(
      "https://heykiwi.io/api/trigger-notification",
      {
        userId,
        messageText,
      },
    );

    return response;
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
