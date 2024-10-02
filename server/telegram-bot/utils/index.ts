export const extractPaymentBeneficiaryFromUrl = (url: string): string | null => {
    const urlPattern = /^https:\/\/kiwi-bot\.vercel\.app\/pay\/([a-zA-Z0-9_]+)$/;
    const match = url.match(urlPattern);

    if (match && match[1]) {
        return match[1];
    }    
    
    return null;
}