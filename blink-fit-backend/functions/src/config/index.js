"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvironment = exports.APP_CONFIG = exports.GEMINI_CONFIG = exports.googleApiKey = void 0;
const params_1 = require("firebase-functions/params");
// Get API key from Secret Manager
exports.googleApiKey = (0, params_1.defineSecret)("GOOGLE_API_KEY");
// Gemini configuration
exports.GEMINI_CONFIG = {
    model: "gemini-2.0-flash-lite",
    temperature: 0.7,
    maxOutputTokens: 1024,
};
// App configuration
exports.APP_CONFIG = {
    region: "northamerica-northeast2",
    memory: "256MiB",
    timeoutSeconds: 60,
    cors: { origin: true },
};
// Environment variables
const getEnvironment = () => ({
    isProduction: process.env.NODE_ENV === 'production',
    googleApiKey: process.env.NODE_ENV === 'production'
        ? exports.googleApiKey.value()
        : process.env.GOOGLE_API_KEY,
});
exports.getEnvironment = getEnvironment;
