export interface BeneficiaryParams {
    username: string;
    address: string;
    token: string;
    amount: number;
}

export const extractPaymentBeneficiaryFromUrl = (url: string): BeneficiaryParams => {
  // Define the regex to match the specific URL pattern, allowing for float values in the amount
  const urlPattern = /^https:\/\/kiwi-bot\.vercel\.app\/pay\/([a-zA-Z0-9_]+)-([a-zA-Z0-9]+)-([A-Z]+)-(\d+(\.\d+)?)$/;

  // Test if the URL matches the pattern
  const match = url.match(urlPattern);

  // If there's a match, return the extracted details
  if (match && match[1] && match[2] && match[3] && match[4]) {
    return {
      username: match[1],
      address: match[2],
      token: match[3],
      amount: parseFloat(match[4]) // Parse the amount as a float
    };
  }

  // If the URL is invalid, return null
  return null;
}