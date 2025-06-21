import { Request, Response } from "express";
import * as logger from "firebase-functions/logger";
import GeminiService from "../services/geminiService";
import { createApiResponse, validateQuizData, generateFallbackGuide } from "../utils/helpers";
import { GuideRequest } from "../types";

const geminiService = GeminiService.getInstance();

/**
 * POST /api/generate-guide - Generate personalized eye health guide
 */
export const generateGuide = async (req: Request, res: Response) => {
  try {
    logger.info("Guide generation API called", { structuredData: true });
    
    const { userId, quiz, subjective }: GuideRequest = req.body;
    
    // Input validation
    const validation = validateQuizData(userId, quiz);
    if (!validation.isValid) {
      return res.status(400).json(createApiResponse(
        false,
        validation.error,
        undefined,
        undefined,
        validation.error
      ));
    }

    // Initialize Gemini if not already done
    if (!geminiService.isAvailable()) {
      geminiService.initialize();
    }
    
    // Convert quiz array to level scores for fallback calculation
    const quizLevels = quiz.map(q => q.level);
    
    if (geminiService.isAvailable()) {
      try {
        const guideData = await geminiService.generateGuide(userId, quiz, subjective);
        
        return res.json({
          message: "Quiz submitted and AI-based guide generated successfully",
          guide: guideData,
          timestamp: new Date().toISOString(),
          source: "Gemini AI"
        });
      } catch (parseError) {
        logger.error("Gemini guide generation failed:", parseError);
        
        // Fallback: Generate default guide
        const fallbackGuide = generateFallbackGuide(quizLevels, subjective);
        
        return res.json({
          message: "Quiz submitted and AI-based guide generated successfully",
          guide: fallbackGuide,
          timestamp: new Date().toISOString(),
          source: "Fallback Algorithm"
        });
      }
    } else {
      // Fallback when Gemini is disabled
      const fallbackGuide = generateFallbackGuide(quizLevels, subjective);
      
      return res.json({
        message: "Quiz submitted and AI-based guide generated successfully",
        guide: fallbackGuide,
        timestamp: new Date().toISOString(),
        source: "Fallback Algorithm (Gemini disabled)"
      });
    }
    
  } catch (error) {
    logger.error("Guide generation API error:", error);
    
    return res.status(500).json(createApiResponse(
      false,
      "An error occurred during guide generation",
      undefined,
      undefined,
      error instanceof Error ? error.message : "Unknown error"
    ));
  }
};
