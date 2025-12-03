import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.constructionmanagement',
  appName: 'Construction Management',
  webDir: 'dist',
  server: {
    url: 'https://2ced7393-cb91-4168-8a20-7d9950a42bfa.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
