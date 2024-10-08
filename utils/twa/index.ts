import { initHapticFeedback } from "@telegram-apps/sdk";
import {  } from '@telegram-apps/sdk';

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
  closeMiniApp: () => void;
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
    const hapticFeedback = initHapticFeedback();

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

  const closeMiniApp = () => {
    closeMiniApp();
  }
  return {
    vibrate,
    closeMiniApp
  };
};
