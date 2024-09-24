import WebApp from '@twa-dev/sdk';

interface useTelegramComposableState {
  showAlert: (text: string) => void;
  openInvoice: (url: string, callback: (status: 'pending' | 'failed' | 'cancelled' | 'paid') => void) => void;
  closeApp: () => void;
  expand: () => void;
  getViewportHeight: () => number;
  vibrate: (style?: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' | 'error' | 'warning' | 'success') => void;
  ready: () => void;
  colorScheme: 'light' | 'dark' | undefined;
  platform: 'android' | 'android_x' | 'ios' | 'macos' | 'tdesktop' | 'web' | 'weba' | 'webk' | 'unigram' | 'unknown';
  headerColor: string;
  setHeaderColor: (color: 'bg_color' | 'secondary_bg_color' | `#${string}`) => void;
}

/**
 * Composable to work with Telegram using the Mini Apps SDK
 *
 * @see https://core.telegram.org/bots/webapps
 */
export default function useTelegram(): useTelegramComposableState {

  /**
   * Shows native Telegram alert message
   *
   * @param text The text to show in the alert
   */
  function showAlert(text: string): void {
    WebApp.showAlert(text);
  }

  /**
   * Opens Telegram invoice
   *
   * @param url The invoice URL
   * @param callback The callback to call when the invoice is paid
   */
  function openInvoice(url: string, callback: (status: 'pending' | 'failed' | 'cancelled' | 'paid') => void): void {
    WebApp.openInvoice(url, callback);
  }

  /**
   * Closes the app
   */
  function closeApp(): void {
    WebApp.close();
  }

  /**
   * Expands Telegram app layout
   */
  function expand(): void {
    WebApp.expand();
  }

  /**
   *
   * The current height of the visible area of the Mini App. Also available in CSS as the variable var(--tg-viewport-height).
   * The application can display just the top part of the Mini App, with its lower part remaining outside the screen area.
   * From this position, the user can “pull” the Mini App to its maximum height, while the bot can do the same by calling the expand() method.
   * As the position of the Mini App changes, the current height value of the visible area will be updated in real time.
   * Please note that the refresh rate of this value is not sufficient to smoothly follow the lower border of the window.
   * It should not be used to pin interface elements to the bottom of the visible area.
   * It's more appropriate to use the value of the viewportStableHeight field for this purpose.
   */
  function getViewportHeight(): number {
    return WebApp.viewportStableHeight;
  }

  /**
   * Vibrate the device
   *
   * @param style The style of the vibration
   */
  function vibrate(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' | 'error' | 'warning' | 'success' = 'heavy'): void {
    switch (style) {
      case 'light':
      case 'medium':
      case 'heavy':
      case 'rigid':
      case 'soft':
        WebApp.HapticFeedback.impactOccurred(style);
        break;
      case 'error':
      case 'warning':
      case 'success':
        WebApp.HapticFeedback.notificationOccurred(style);
        break;
    }
  }

  /**
   * Tells Telegram
   */
  function ready(): void {
    WebApp.ready();
  }

  /**
   * Sets the header color of the app wrapper
   */
  function setHeaderColor(color: 'bg_color' | 'secondary_bg_color' | `#${string}`): void {
    WebApp.setHeaderColor(color);
  }

  /**
   * The current color scheme of the device. Can be light or dark.
   * If app is launched in a browser, the value will be undefined.
   */
  const colorScheme = WebApp.platform !== 'unknown' ? WebApp.colorScheme : undefined;

  /**
   * The current platform of the device.
   */
  const platform = WebApp.platform;

  /**
   * The current header color of the app wrapper
   */
  const headerColor = WebApp.headerColor;

  return {
    showAlert,
    openInvoice,
    closeApp,
    expand,
    getViewportHeight,
    vibrate,
    ready,
    colorScheme,
    platform,
    headerColor,
    setHeaderColor,
  };
}