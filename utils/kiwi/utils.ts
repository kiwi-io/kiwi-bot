import axios from "axios";

export const getTelegramUserData = async(username: string) => {
    try {
        const response = await axios.get(`https://kiwi-bot.vercel.app/api/privy/get-telegram-userid?telegramUsername=${username}`);

        console.log("response: ", response);
    }
    catch(err) {
        console.log("Error fetching user data: ", err);
    }
}
