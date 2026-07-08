import type { CapacitorConfig } from '@capacitor/cli';

// Native shell config for the iOS / Android builds (Phase 4).
// The web layer is the same offline-first PWA that ships to the web target:
// `webDir` points at the built SPA, so `cap sync` bundles those assets into
// each native app. No live/gov-data tools are wired here — this is a
// packaging layer over the existing on-device engines.
const config: CapacitorConfig = {
  appId: 'dev.zii.knife',
  appName: 'Zii',
  webDir: 'dist',
  // Bundle the web assets into the app; load them from the local scheme so
  // everything works fully offline with no dev server.
  server: {
    androidScheme: 'https',
  },
};

export default config;
