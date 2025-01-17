import { initHapticFeedback } from "twa-sdk-v1";
import { closeMiniApp, swipeBehavior } from "twa-sdk-v2";

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
  disableVerticalSwipe: () => void;
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

  const closeApp = () => {
    closeMiniApp();
  };

  const disableVerticalSwipe = () => {
    swipeBehavior.disableVertical();
  };

  return {
    vibrate,
    closeApp,
    disableVerticalSwipe,
  };
};
