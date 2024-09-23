export const  increaseDimensionsInUrl = (url: string, newWidth: number, newHeight: number): string => {
    const parsedUrl = new URL(url);
  
    parsedUrl.searchParams.set('w', newWidth.toString());
    parsedUrl.searchParams.set('h', newHeight.toString());
  
    return parsedUrl.toString();
  }