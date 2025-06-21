"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const logger = __importStar(require("firebase-functions/logger"));
const config_1 = require("../config");
class GeminiService {
    constructor() {
        this.genAI = null;
        this.model = null;
        this.isInitialized = false;
    }
    static getInstance() {
        if (!GeminiService.instance) {
            GeminiService.instance = new GeminiService();
        }
        return GeminiService.instance;
    }
    initialize() {
        if (this.isInitialized) {
            return true;
        }
        try {
            const { googleApiKey } = (0, config_1.getEnvironment)();
            if (googleApiKey) {
                this.genAI = new generative_ai_1.GoogleGenerativeAI(googleApiKey);
                this.model = this.genAI.getGenerativeModel({
                    model: config_1.GEMINI_CONFIG.model,
                    generationConfig: {
                        temperature: config_1.GEMINI_CONFIG.temperature,
                        maxOutputTokens: config_1.GEMINI_CONFIG.maxOutputTokens,
                    }
                });
                this.isInitialized = true;
                logger.info("Gemini API initialization successful");
                return true;
            }
            else {
                logger.warn("GOOGLE_API_KEY not set. Running in fallback mode.");
                return false;
            }
        }
        catch (error) {
            logger.error("Gemini API initialization failed:", error);
            return false;
        }
    }
    isAvailable() {
        return this.isInitialized && this.model !== null;
    }
    generateContent(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAvailable()) {
                this.initialize();
            }
            if (!this.model) {
                throw new Error("Gemini model not available");
            }
            try {
                const result = yield this.model.generateContent(prompt);
                return result.response.text();
            }
            catch (error) {
                logger.error("Gemini content generation failed:", error);
                throw error;
            }
        });
    }
    generateGreeting(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = `Hello! Please write a warm and friendly greeting for ${userName}. 
    Welcome them to the Eye-Shield service and include an encouraging message about eye health management. 
    Please write 2-3 sentences concisely.`;
            return this.generateContent(prompt);
        });
    }
    generateConversationResponse(userName, userMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = `User "${userName}" sent the following message: "${userMessage}"
    
    As an AI assistant for the Eye-Shield eye health management service, please provide a warm and helpful response. 
    Please naturally include advice or encouragement related to eye health. Answer in 2-3 sentences.`;
            return this.generateContent(prompt);
        });
    }
    generateGuide(userId, quiz, subjective) {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = `
You are an eye health specialist AI assistant. Please analyze the user's quiz responses and generate a personalized guide.

**User ID:** ${userId}

**Quiz Responses:**
1. Vision device: ${quiz[0].answer} (Level: ${quiz[0].level})
2. Eye conditions: ${quiz[1].answer} (Level: ${quiz[1].level})
3. Eye fatigue frequency: ${quiz[2].answer} (Level: ${quiz[2].level})
4. Daily screen time: ${quiz[3].answer} (Level: ${quiz[3].level})
5. Break habits: ${quiz[4].answer} (Level: ${quiz[4].level})
6. Light sensitivity: ${quiz[5].answer} (Level: ${quiz[5].level})
7. Headaches/blurred vision: ${quiz[6].answer} (Level: ${quiz[6].level})

**Personal Preferences:**
- Break preference: ${(subjective === null || subjective === void 0 ? void 0 : subjective.breakPreference) || 'Not provided'}
- Favorite snack: ${(subjective === null || subjective === void 0 ? void 0 : subjective.favoriteSnack) || 'Not provided'}
- Favorite place: ${(subjective === null || subjective === void 0 ? void 0 : subjective.favoritePlace) || 'Not provided'}

Please respond with the following JSON format based on the comprehensive information above:

{
  "workDuration": "number with unit (e.g., '25 minutes')",
  "breakDuration": "number with unit (e.g., '7 minutes')", 
  "screenTimeLimit": "number with unit (e.g., '5 hours/day')",
  "Exercise": ["exercise1", "exercise2", "exercise3"]
}

Please provide safe and practical recommendations based on medical evidence. Include 3-4 specific eye exercises that are suitable for the user's condition and preferences.
`;
            const response = yield this.generateContent(prompt);
            // Try to parse JSON response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            else {
                throw new Error("JSON format not found in Gemini response");
            }
        });
    }
    generateExerciseGuide(userPreferences, currentBreakCount, workDuration) {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = `
You are Eye-Shield's friendly AI assistant. Please generate a personalized exercise guide suitable for the user's break time.

**User Information:**
- Personal preferences: ${userPreferences ? userPreferences.join(', ') : 'No specific preferences'}
- Current break count: ${currentBreakCount || 1} time(s)
- Work duration: ${workDuration || 'Unknown'} minutes

**Requirements:**
1. Write concisely in 2-3 sentences
2. Naturally reflect user preferences
3. Suggest specific activities beneficial for eye health
4. Use a warm and encouraging tone
5. Provide different suggestions each time (prevent repetition)

Please respond in the following JSON format:

{
  "message": "personalized exercise guide message",
  "activityType": "eye_exercise/physical_movement/relaxation/combination",
  "duration": "recommended time (minutes)",
  "tips": ["specific tip1", "specific tip2"]
}

Examples:
- If user likes "drinking tea" → suggest brewing tea while looking out the window
- If user likes "listening to music" → suggest neck and shoulder stretching with music
`;
            const response = yield this.generateContent(prompt);
            // Try to parse JSON response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            else {
                throw new Error("JSON format not found in Gemini response");
            }
        });
    }
}
exports.default = GeminiService;
