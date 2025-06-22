import { Request, Response } from "express";
import * as logger from "firebase-functions/logger";
import GeminiService from "../services/geminiService";
import { createApiResponse, validateQuizData, generateFallbackGuide } from "../utils/helpers";
import { GuideRequest } from "../types/database";
import { UserRepository } from "../repositories/UserRepository";
import { QuizResponseRepository } from "../repositories/QuizResponseRepository";
import { connectDB } from "../config/database";
import { IQuizAnswer, ISubjectiveData } from "../models/QuizResponse";

const geminiService = GeminiService.getInstance();
const userRepository = new UserRepository();
const quizRepository = new QuizResponseRepository();

/**
 * POST /api/generate-guide - Generate personalized eye health guide
 */
export const generateGuide = async (req: Request, res: Response) => {
  try {
    console.log("Guide generation API called");
    
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

    // Ensure database connection
    await connectDB();

    // Convert quiz format for database storage
    const quizForDB: IQuizAnswer[] = quiz.map(q => ({
      questionId: q.questionId || 1,
      answer: q.answer,
      level: 0 // Level not needed for LLM processing
    }));

    // Save quiz response to MongoDB (only if subjective data exists)
    if (subjective) {
      try {
        const subjectiveForDB: ISubjectiveData = {
          breakPreference: subjective.breakPreference || 'Exercise',
          favoriteSnack: subjective.favoriteSnack || 'Tea',
          focusSessionLength: subjective.focusSessionLength || '1',
          screenTimeGoal: subjective.screenTimeGoal || '8'
        };

        const quizResponse = await quizRepository.createQuizResponse(userId, quizForDB, subjectiveForDB);
        console.log(`Quiz response saved with session ID: ${quizResponse.sessionId}`);
      } catch (dbError) {
        console.error("Failed to save quiz response:", dbError);
        // Continue with guide generation even if DB save fails
      }

      // Update user preferences and goals from subjective data
      try {
        const screenTimeGoalHours = parseInt(subjective.screenTimeGoal) || 8;
        const focusSessionLengthMinutes = (parseInt(subjective.focusSessionLength) || 1) * 60; // Convert hours to minutes
        
        await userRepository.updateUserFromQuiz(
          userId,
          subjective.breakPreference,
          subjective.favoriteSnack,
          screenTimeGoalHours,
          focusSessionLengthMinutes
        );
        console.log(`User ${userId} data updated from quiz`);
      } catch (dbError) {
        console.error("Failed to update user data:", dbError);
        // Continue with guide generation even if update fails
      }
    }

    // Initialize Gemini if not already done
    if (!geminiService.isAvailable()) {
      geminiService.initialize();
    }
    
    if (geminiService.isAvailable()) {
      try {
        const guideData = await geminiService.generateGuide(userId, quiz, subjective);
        
        // Update user behavior data with guide generation activity
        try {
          await userRepository.updateUserData(userId, {
            // You can add any behavior tracking here
            // For example, count of guide generations, etc.
          });
        } catch (dbError) {
          console.error("Failed to update user behavior data:", dbError);
        }
        
        return res.json({
          message: "Quiz submitted and AI-based guide generated successfully",
          guide: guideData,
          timestamp: new Date().toISOString(),
          source: "Gemini AI"
        });
      } catch (parseError) {
        console.error("Gemini guide generation failed:", parseError);
        
        // Fallback: Generate default guide
        const fallbackGuide = generateFallbackGuide(quiz, subjective);
        
        return res.json({
          message: "Quiz submitted and AI-based guide generated successfully",
          guide: fallbackGuide,
          timestamp: new Date().toISOString(),
          source: "Fallback Algorithm"
        });
      }
    } else {
      // Fallback when Gemini is disabled
      const fallbackGuide = generateFallbackGuide(quiz, subjective);
      
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
