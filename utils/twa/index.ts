import { hapticFeedback } from "@telegram-apps/sdk";
import { closeMiniApp } from '@telegram-apps/sdk';

interface useTelegramComposableState {
  vibrate: (
    style?:
      | "light"
      | "medium"
      | "heavy"
      | "rigid"
      | "soft"
      | "error"
      | "warning"
      | "success",
  ) => void;
  closeApp: () => void;
}

export const useTelegram = (): useTelegramComposableState => {
  const vibrate = (
    style:
      | "light"
      | "medium"
      | "heavy"
      | "rigid"
      | "soft"
      | "error"
      | "warning"
      | "success" = "heavy",
  ): void => {
    if(!hapticFeedback.isSupported()) {
      console.log("vibrator not supported");
      return;
    }

    switch (style) {
      case "light":
      case "medium":
      case "heavy":
      case "rigid":
      case "soft":
        hapticFeedback.impactOccurred(style);
        break;
      case "error":
      case "warning":
      case "success":
        hapticFeedback.notificationOccurred(style);
        break;
    }
  };

  const closeApp = () => {
    closeMiniApp();
  }
  return {
    vibrate,
    closeApp
  };
};
