import { defineSecret } from "firebase-functions/params";

// Get API key from Secret Manager
export const googleApiKey = defineSecret("GOOGLE_API_KEY");

// Gemini configuration
export const GEMINI_CONFIG = {
  model: "gemini-2.0-flash-lite",
  temperature: 0.7,
  maxOutputTokens: 1024,
} as const;

// App configuration
export const APP_CONFIG = {
  region: "northamerica-northeast2",
  memory: "256MiB" as const,
  timeoutSeconds: 60,
  cors: { origin: true },
} as const;

// Environment variables
export const getEnvironment = () => ({
  isProduction: process.env.NODE_ENV === 'production',
  googleApiKey: process.env.NODE_ENV === 'production' 
    ? googleApiKey.value()
    : process.env.GOOGLE_API_KEY,
});
