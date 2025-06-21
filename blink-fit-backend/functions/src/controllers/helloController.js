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
exports.postHello = exports.getHello = exports.healthCheck = void 0;
const logger = __importStar(require("firebase-functions/logger"));
const geminiService_1 = __importDefault(require("../services/geminiService"));
const helpers_1 = require("../utils/helpers");
const geminiService = geminiService_1.default.getInstance();
/**
 * Basic health check endpoint
 */
const healthCheck = (req, res) => {
    res.json({ message: "Firebase Functions v2 server is running!" });
};
exports.healthCheck = healthCheck;
/**
 * GET /api/hello - Generate greeting message
 */
const getHello = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger.info("Hello API called", { structuredData: true });
        const { name } = req.query;
        const userName = name || "anonymous user";
        if (geminiService.isAvailable()) {
            try {
                const geminiMessage = yield geminiService.generateGreeting(userName);
                res.json((0, helpers_1.createApiResponse)(true, geminiMessage, { userName }, "Gemini AI"));
            }
            catch (error) {
                logger.error("Gemini API error:", error);
                // Fallback to default message
                const fallbackMessage = name ?
                    `Hello, ${name}! Welcome to Eye-Shield. Let's protect your eye health together!` :
                    "Hello! Welcome to Eye-Shield. Let's protect your eye health together!";
                res.json((0, helpers_1.createApiResponse)(true, fallbackMessage, { userName }, "Fallback", "Temporary Gemini API error"));
            }
        }
        else {
            // Initialize Gemini and try again
            geminiService.initialize();
            const fallbackMessage = name ?
                `Hello, ${name}! Welcome to Eye-Shield. Let's protect your eye health together!` :
                "Hello! Welcome to Eye-Shield. Let's protect your eye health together!";
            res.json((0, helpers_1.createApiResponse)(true, fallbackMessage, { userName }, "Fallback (Gemini disabled)"));
        }
    }
    catch (error) {
        logger.error("Hello API error:", error);
        res.status(500).json((0, helpers_1.createApiResponse)(false, "Internal server error", undefined, undefined, error instanceof Error ? error.message : "Unknown error"));
    }
});
exports.getHello = getHello;
/**
 * POST /api/hello - Generate conversation response
 */
const postHello = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger.info("Hello POST API called", { structuredData: true });
        const { name, message: userMessage } = req.body;
        const userName = name || "anonymous user";
        if (geminiService.isAvailable()) {
            try {
                const geminiResponse = yield geminiService.generateConversationResponse(userName, userMessage || 'Hello');
                res.json((0, helpers_1.createApiResponse)(true, geminiResponse, {
                    userName,
                    userMessage: userMessage || "none",
                    received: req.body
                }, "Gemini AI"));
            }
            catch (error) {
                logger.error("Gemini API error:", error);
                // Fallback response
                const fallbackMessage = `Hello, ${userName}! Message: ${userMessage || "none"} - Eye-Shield will protect your eye health!`;
                res.json((0, helpers_1.createApiResponse)(true, fallbackMessage, {
                    userName,
                    userMessage: userMessage || "none",
                    received: req.body
                }, "Fallback", "Temporary Gemini API error"));
            }
        }
        else {
            // Initialize Gemini and use fallback
            geminiService.initialize();
            const fallbackMessage = `Hello, ${userName}! Message: ${userMessage || "none"} - Eye-Shield will protect your eye health!`;
            res.json((0, helpers_1.createApiResponse)(true, fallbackMessage, {
                userName,
                userMessage: userMessage || "none",
                received: req.body
            }, "Fallback (Gemini disabled)"));
        }
    }
    catch (error) {
        logger.error("Hello POST API error:", error);
        res.status(500).json((0, helpers_1.createApiResponse)(false, "Internal server error", undefined, undefined, error instanceof Error ? error.message : "Unknown error"));
    }
});
exports.postHello = postHello;
