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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGuide = void 0;
const logger = __importStar(require("firebase-functions/logger"));
const geminiService_1 = __importDefault(require("../services/geminiService"));
const helpers_1 = require("../utils/helpers");
const geminiService = geminiService_1.default.getInstance();
/**
 * POST /api/generate-guide - Generate personalized eye health guide
 */
const generateGuide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger.info("Guide generation API called", { structuredData: true });
        const { userId, quiz, subjective } = req.body;
        // Input validation
        const validation = (0, helpers_1.validateQuizData)(userId, quiz);
        if (!validation.isValid) {
            return res.status(400).json((0, helpers_1.createApiResponse)(false, validation.error, undefined, undefined, validation.error));
        }
        // Initialize Gemini if not already done
        if (!geminiService.isAvailable()) {
            geminiService.initialize();
        }
        // Convert quiz array to level scores for fallback calculation
        const quizLevels = quiz.map(q => q.level);
        if (geminiService.isAvailable()) {
            try {
                const guideData = yield geminiService.generateGuide(userId, quiz, subjective);
                return res.json({
                    message: "Quiz submitted and AI-based guide generated successfully",
                    guide: guideData,
                    timestamp: new Date().toISOString(),
                    source: "Gemini AI"
                });
            }
            catch (parseError) {
                logger.error("Gemini guide generation failed:", parseError);
                // Fallback: Generate default guide
                const fallbackGuide = (0, helpers_1.generateFallbackGuide)(quizLevels, subjective);
                return res.json({
                    message: "Quiz submitted and AI-based guide generated successfully",
                    guide: fallbackGuide,
                    timestamp: new Date().toISOString(),
                    source: "Fallback Algorithm"
                });
            }
        }
        else {
            // Fallback when Gemini is disabled
            const fallbackGuide = (0, helpers_1.generateFallbackGuide)(quizLevels, subjective);
            return res.json({
                message: "Quiz submitted and AI-based guide generated successfully",
                guide: fallbackGuide,
                timestamp: new Date().toISOString(),
                source: "Fallback Algorithm (Gemini disabled)"
            });
        }
    }
    catch (error) {
        logger.error("Guide generation API error:", error);
        return res.status(500).json((0, helpers_1.createApiResponse)(false, "An error occurred during guide generation", undefined, undefined, error instanceof Error ? error.message : "Unknown error"));
    }
});
exports.generateGuide = generateGuide;
