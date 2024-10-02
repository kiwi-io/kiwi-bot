export interface BeneficiaryParams {
    username: string;
    address: string;
}

export const extractPaymentBeneficiaryFromUrl = (url: string): BeneficiaryParams => {
  // Define the regex to match the specific URL pattern
  const urlPattern = /^https:\/\/kiwi-bot\.vercel\.app\/pay\/([a-zA-Z0-9_]+)-([a-zA-Z0-9]+)$/;

  // Test if the URL matches the pattern
  const match = url.match(urlPattern);

  // If there's a match, return the extracted username and address
  if (match && match[1] && match[2]) {
    return {
      username: match[1],
      address: match[2]
    } as BeneficiaryParams;
  }

  // If the URL is invalid, return null
  return null;
}