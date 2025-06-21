import { onRequest } from "firebase-functions/v2/https";
import express from "express";
import cors from "cors";
import routes from "./routes";
import { APP_CONFIG, googleApiKey } from "./config";
import GeminiService from "./services/geminiService";
import "dotenv/config";

// Initialize Express app
const app = express();

// CORS configuration
app.use(cors(APP_CONFIG.cors));

// JSON parsing middleware
app.use(express.json());

// Initialize Gemini service
const geminiService = GeminiService.getInstance();
geminiService.initialize();

// Use routes
app.use(routes);

// Export as Firebase Functions v2
export const api = onRequest(
  {
    region: APP_CONFIG.region,
    memory: APP_CONFIG.memory,
    timeoutSeconds: APP_CONFIG.timeoutSeconds,
    secrets: [googleApiKey], // Use Secret Manager
  },
  app
);
