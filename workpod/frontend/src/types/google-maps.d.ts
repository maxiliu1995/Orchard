/// <reference types="@types/google.maps" />

declare global {
  interface Window {
    google: typeof google;
  }
}

declare module 'google-maps' {
  export = google.maps;
}

export {}; 