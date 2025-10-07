import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.695bfd7063ca422d81239dae40fae916',
  appName: 'HeavyRent',
  webDir: 'dist',
  // IMPORTANT: For PRODUCTION BUILD, comment out the server section below
  // For DEVELOPMENT: Keep server section for hot-reload testing
  server: {
    url: 'https://695bfd70-63ca-422d-8123-9dae40fae916.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1A1F2C",
      showSpinner: false
    }
  }
};

export default config;