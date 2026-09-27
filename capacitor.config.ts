import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mitanshu.welth",
  appName: "Welth",
  webDir: "out",
  server: {
    url: "https://aimastermoney-hvdj.vercel.app",
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
  },
  ios: {
    contentInset: "automatic",
  },
};

export default config;
