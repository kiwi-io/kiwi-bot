import axios from "axios";

export const pregenerateWallet = async (username: string) => {

  const data = {
    create_ethereum_wallet: false,
    create_solana_wallet: true,
    linked_accounts: [
      {
        username: username,
        type: 'telegram'
      }
    ]
  };

  try {
    const response = await axios.post('https://auth.privy.io/api/v1/users', data, {
      auth: {
        username: process.env.NEXT_PRIVY_APP_ID,
        password: process.env.NEXT_PRIVY_SECRET
      },
      headers: {
        'privy-app-id': process.env.NEXT_PRIVY_APP_ID,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}