import { Request, Response } from "express";
import * as logger from "firebase-functions/logger";
import GeminiService from "../services/geminiService";
import { createApiResponse, validateQuizData, generateFallbackGuide } from "../utils/helpers";
import { GuideRequest } from "../types";

const geminiService = GeminiService.getInstance();

/**
 * POST /api/generate-guide - Generate personalized eye health guide
 */
export const generateGuide = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("Guide generation API called", { structuredData: true });
    
    const { userId, quiz, subjective }: GuideRequest = req.body;
    
    // Validate input data
    const validation = validateQuizData(userId, quiz);
    if (!validation.isValid) {
      res.status(400).json(createApiResponse(
        false,
        validation.error,
        undefined,
        undefined,
        validation.error
      ));
      return; // Explicitly return after sending response
    }

    // Initialize Gemini service if not already initialized
    if (!geminiService.isAvailable()) {
      geminiService.initialize();
    }
    
    // Convert quiz array to level scores for fallback calculation
    const quizLevels = quiz.map(q => q.level);
    
    if (geminiService.isAvailable()) {
      try {
        const guideData = await geminiService.generateGuide(userId, quiz, subjective);
        
        res.json({
          message: "Quiz submitted and AI-based guide generated successfully",
          guide: guideData,
          timestamp: new Date().toISOString(),
          source: "Gemini AI"
        });
        return; // Explicitly return after sending response
      } catch (parseError) {
        logger.error("Gemini guide generation failed:", parseError);
        
        // Fallback: Generate default guide
        const fallbackGuide = generateFallbackGuide(quizLevels, subjective);
        
        res.json({
          message: "Quiz submitted and AI-based guide generated successfully",
          guide: fallbackGuide,
          timestamp: new Date().toISOString(),
          source: "Fallback Algorithm"
        });
        return; // Explicitly return after sending response
      }
    } else {
      // Fallback when Gemini is disabled
      const fallbackGuide = generateFallbackGuide(quizLevels, subjective);
      
      res.json({
        message: "Quiz submitted and AI-based guide generated successfully",
        guide: fallbackGuide,
        timestamp: new Date().toISOString(),
        source: "Fallback Algorithm (Gemini disabled)"
      });
      return; // Explicitly return after sending response
    }
    
  } catch (error) {
    logger.error("Guide generation API error:", error);
    
    res.status(500).json(createApiResponse(
      false,
      "An error occurred during guide generation",
      undefined,
      undefined,
      error instanceof Error ? error.message : "Unknown error"
    ));
    return; // Explicitly return after sending response
  }
};
