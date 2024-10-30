import axios from "axios";

export const getTelegramUserData = async(username: string) => {
    try {
        const response = await axios.get(`https://kiwi-bot.vercel.app/api/privy/get-telegram-userid?telegramUsername=${username}`);
        return response.data;
    }
    catch(err) {
        console.log("Error fetching user data: ", err);
    }
}
