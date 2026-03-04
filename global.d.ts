export {};

declare global {
  interface Window {
    __MICROFRONTEND__?: boolean;
  }
}
