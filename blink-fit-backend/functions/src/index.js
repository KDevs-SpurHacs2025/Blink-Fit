"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const https_1 = require("firebase-functions/v2/https");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const config_1 = require("./config");
const geminiService_1 = __importDefault(require("./services/geminiService"));
require("dotenv/config");
// Initialize Express app
const app = (0, express_1.default)();
// CORS configuration
app.use((0, cors_1.default)(config_1.APP_CONFIG.cors));
// JSON parsing middleware
app.use(express_1.default.json());
// Initialize Gemini service
const geminiService = geminiService_1.default.getInstance();
geminiService.initialize();
// Use routes
app.use(routes_1.default);
// Export as Firebase Functions v2
exports.api = (0, https_1.onRequest)({
    region: config_1.APP_CONFIG.region,
    memory: config_1.APP_CONFIG.memory,
    timeoutSeconds: config_1.APP_CONFIG.timeoutSeconds,
    secrets: [config_1.googleApiKey], // Use Secret Manager
}, app);
