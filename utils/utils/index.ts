export const increaseDimensionsInUrl = (
  url: string,
  newWidth: number,
  newHeight: number,
): string => {
  const parsedUrl = new URL(url);

  parsedUrl.searchParams.set("w", newWidth.toString());
  parsedUrl.searchParams.set("h", newHeight.toString());

  return parsedUrl.toString();
};

export const removeCommas = (value: string): string => {
  return value.replace(/,/g, "");
};

export const formatWithCommas = (value: string): string => {
  const withoutCommas = removeCommas(value);

  const parts = withoutCommas.split(".");
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const formattedValue =
    parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
  return formattedValue;
};

export const delay = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

export const trimAddress = (address: string) => {
  if (address.length <= 8) {
    return address;
  }

  const firstPart = address.slice(0, 6);
  const lastPart = address.slice(-6);

  return `${firstPart}......${lastPart}`;
};


export const decodeTelegramCompatibleUrl = (startParam: string) => {
  if(!startParam.startsWith("https")) {
    let base64String = startParam.replace(/-/g, '+').replace(/_/g, '/');
    while (base64String.length % 4) {
      base64String += '=';
    }
    let decodedUrl = atob(base64String);

    return decodedUrl;
  }
  else {
    return undefined;
  }
}