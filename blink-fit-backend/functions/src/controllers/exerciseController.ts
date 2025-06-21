import { Request, Response } from "express";
import * as logger from "firebase-functions/logger";
import GeminiService from "../services/geminiService";
import { createApiResponse, generateFallbackExercise } from "../utils/helpers";
import { ExerciseRequest } from "../types";

const geminiService = GeminiService.getInstance();

/**
 * POST /api/exercise-guidance - Generate dynamic exercise guide
 */
export const generateExerciseGuide = async (req: Request, res: Response) => {
  try {
    logger.info("Exercise guide API called", { structuredData: true });
    
    const { userPreferences, currentBreakCount, workDuration }: ExerciseRequest = req.body;
    
    // Initialize Gemini if not already done
    if (!geminiService.isAvailable()) {
      geminiService.initialize();
    }
    
    if (geminiService.isAvailable()) {
      try {
        const exerciseData = await geminiService.generateExerciseGuide(
          userPreferences, 
          currentBreakCount, 
          workDuration
        );
        
        res.json(createApiResponse(
          true,
          "Exercise guide generated successfully",
          {
            exercise: exerciseData,
            breakCount: currentBreakCount || 1
          },
          "Gemini AI"
        ));
      } catch (parseError) {
        logger.error("Exercise guide JSON parsing error:", parseError);
        
        // Fallback exercise guide
        const fallbackExercise = generateFallbackExercise(userPreferences, currentBreakCount);
        
        res.json(createApiResponse(
          true,
          "Exercise guide generated successfully",
          {
            exercise: fallbackExercise,
            breakCount: currentBreakCount || 1
          },
          "Fallback Algorithm"
        ));
      }
    } else {
      // Fallback when Gemini is disabled
      const fallbackExercise = generateFallbackExercise(userPreferences, currentBreakCount);
      
      res.json(createApiResponse(
        true,
        "Exercise guide generated successfully",
        {
          exercise: fallbackExercise,
          breakCount: currentBreakCount || 1
        },
        "Fallback Algorithm (Gemini disabled)"
      ));
    }
    
  } catch (error) {
    logger.error("Exercise guide API error:", error);
    
    res.status(500).json(createApiResponse(
      false,
      "An error occurred during exercise guide generation",
      undefined,
      undefined,
      error instanceof Error ? error.message : "Unknown error"
    ));
  }
};
