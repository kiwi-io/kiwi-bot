export interface BeneficiaryParams {
  username: string;
  address: string;
  token: string;
  amount: number;
}

export const extractPaymentBeneficiaryFromUrl = (
  url: string,
): BeneficiaryParams => {
  // Define the regex to match the specific URL pattern, allowing for float values in the amount
  const urlPattern =
    /^https:\/\/kiwi-bot\.vercel\.app\/pay\/([a-zA-Z0-9_]+)-([a-zA-Z0-9]+)-([A-Z]+)-(\d+(\.\d+)?)$/;

  // Test if the URL matches the pattern
  const match = url.match(urlPattern);

  // If there's a match, return the extracted details
  if (match && match[1] && match[2] && match[3] && match[4]) {
    return {
      username: match[1],
      address: match[2],
      token: match[3],
      amount: parseFloat(match[4]), // Parse the amount as a float
    };
  }

  // If the URL is invalid, return null
  return null;
};

export const formatNumberWithDenominations = (num: number): string => {
  if (num >= 1_000_000_000_000) {
    return `${(num / 1_000_000_000_000).toFixed(2)}T`;
  } else if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)}B`;
  } else if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  } else if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)}K`;
  } else {
    return num.toString();
  }
};

export const encodeTelegramCompatibleURL = (url: string): string => {
  // Base64 encode the URL
  let base64Encoded = btoa(url);
  // Replace +, /, = with URL safe characters (-, _, no = padding)
  let urlSafeBase64 = base64Encoded
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return urlSafeBase64;
};

export const trimString = (str: string): string => {
  if (str.length > 100) {
    return str.slice(0, 100) + "...";
  }
  return str;
};

export const multiplyAmountInUrl = (
  url: string,
  multiplier: number,
): string => {
  // Find the last '/' to locate the amount in the URL
  const lastSlashIndex = url.lastIndexOf("/");
  const queryStartIndex = url.indexOf("?", lastSlashIndex);

  // Extract the amount between the last '/' and the '?'
  const amountStr =
    queryStartIndex === -1
      ? url.substring(lastSlashIndex + 1)
      : url.substring(lastSlashIndex + 1, queryStartIndex);

  // Multiply the amount
  const amount = parseFloat(amountStr);
  let newAmount = amount * multiplier;

  newAmount = Math.min(newAmount, 2);
  let newAmountStr = newAmount.toString();

  // Replace the old amount with the new one
  const newUrl =
    queryStartIndex === -1
      ? url.substring(0, lastSlashIndex + 1) + newAmountStr
      : url.substring(0, lastSlashIndex + 1) +
        newAmountStr +
        url.substring(queryStartIndex);

  return newUrl;
};
