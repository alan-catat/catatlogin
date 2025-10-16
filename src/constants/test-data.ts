// src/constants/config.ts

// domain public (bisa dari .env biar fleksibel)
export const APP_NAME = process.env.NEXT_PUBLIC_SITE_URL;

// API endpoints helper
export const API_HELPER = {
  imageProcessing: `${APP_NAME}/image_upload`,
  checkEmail: `${APP_NAME}/check-email`,
};

// Environment system constants
export const ENVIRONMENT_SYSTEM = {
  appName: "catatin.ai",
  appLogo: "/catatin.png",
  appDarkLogo: "/catatin.png",
};


export const brandColors = {
  primaryBlue: "#05668D",
  primaryGreen: "#A8E063",
};
