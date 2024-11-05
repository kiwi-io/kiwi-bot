import axios from "axios";

export const getTelegramUserData = async (username: string) => {
  try {
    const response = await axios.get(
      `https://www.heykiwi.io/api/privy/get-telegram-userid?telegramUsername=${username}`,
      {
        headers: {
          "Origin": "https://www.heykiwi.io"
        }
      }
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
      "https://www.heykiwi.io/api/trigger-notification",
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
