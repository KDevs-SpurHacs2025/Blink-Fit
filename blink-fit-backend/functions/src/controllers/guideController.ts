import { Request, Response } from "express";
import * as logger from "firebase-functions/logger";
import GeminiService from "../services/geminiService";
import { validateQuizData } from "../utils/helpers";
import { GuideRequest } from "../types";
import { connectDB } from "../config/database";
import { UserRepository } from "../repositories/UserRepository";
import { QuizResponseRepository } from "../repositories/QuizResponseRepository";
import mongoose from "mongoose";

const geminiService = GeminiService.getInstance();
const userRepository = new UserRepository();
const quizRepository = new QuizResponseRepository();

/**
 * POST /api/generate-guide - Generate personalized eye health guide based on 20-20-20 rule
 * 20 minutes screen time, 1 minute break looking at 20 feet (6 meters) distance
 */
export const generateGuide = async (req: Request, res: Response) => {
  try {
    logger.info("20-20-20 based guide generation API called", { structuredData: true });
    
    const { userId, quiz, subjective }: GuideRequest = req.body;
    
    // Input validation
    const validation = validateQuizData(userId, quiz);
    if (!validation.isValid) {
      return res.status(400).json({
        error: validation.error
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        error: "Invalid userId format. Must be a valid ObjectId."
      });
    }

    // Database connection
    await connectDB();

    // Get user profile by ObjectId and extract username
    let userProfile = null;
    let username = null;
    try {
      userProfile = await userRepository.findById(userId);
      if (!userProfile) {
        return res.status(404).json({
          error: "User not found with the provided userId."
        });
      }
      username = userProfile.username;
      logger.info(`Found user: ${username} for ObjectId: ${userId}`);
    } catch (error) {
      logger.error(`Failed to find user with ObjectId ${userId}:`, error);
      return res.status(500).json({
        error: "Failed to retrieve user information."
      });
    }

    // 20-20-20 rule based eye health analysis
    const eyeHealthAnalysis = analyze2020Rule(quiz, userProfile);
    
    // Generate personalized prompt
    const personalizedPrompt = generate2020Prompt(eyeHealthAnalysis, subjective, userProfile);

    // Initialize Gemini if not already done
    if (!geminiService.isAvailable()) {
      geminiService.initialize();
    }
    
    let guideData;
    let source = "Fallback Algorithm";
    
    if (geminiService.isAvailable()) {
      try {
        // Request 20-20-20 based guide from LLM
        guideData = await geminiService.generate2020Guide(personalizedPrompt, eyeHealthAnalysis);
        source = "Gemini AI";
        
        logger.info("20-20-20 guide generated successfully via Gemini AI");
      } catch (parseError) {
        logger.error("Gemini guide generation failed:", parseError);

        // Fallback: 20-20-20 based default guide
        guideData = generate2020FallbackGuide(eyeHealthAnalysis, subjective);
        source = "Enhanced 20-20-20 Fallback Algorithm";
      }
    } else {
      // Fallback when Gemini is disabled
      guideData = generate2020FallbackGuide(eyeHealthAnalysis, subjective);
      source = "Enhanced 20-20-20 Fallback Algorithm (Gemini disabled)";
    }

    // Save quiz response to database (using username for quiz_responses collection)
    try {
      await quizRepository.saveQuizResponse({
        userId: username, // Use username instead of ObjectId for quiz_responses
        responses: quiz.map((q) => ({
          questionId: q.questionId,
          question: `Question ${q.questionId}`,
          answer: q.answer,
          level: calculateQuestionLevel(q.answer, q.questionId)
        })),
        subjective: {
          breakPreference: subjective?.breakPreference || "calm",
          favoriteSnack: subjective?.favoriteSnack || "healthy snack",
          screenTimeGoal: parseInt(subjective?.screenTimeGoal || "0") || eyeHealthAnalysis.recommendedScreenTime,
          focusSessionLength: parseInt(subjective?.focusSessionLength || "0") || eyeHealthAnalysis.recommendedFocusSession
        },
        analysisResults: eyeHealthAnalysis,
        llmResponse: guideData,
        source
      });

      logger.info(`Quiz response saved for user ${username} (ObjectId: ${userId})`);
    } catch (dbError) {
      logger.error("Failed to save quiz response to database:", dbError);
      // Continue execution - don't fail the API if DB save fails
    }

    // Update user profile with quiz subjective data
    try {
      if (userProfile) {
        await userRepository.updateUserFromQuiz(
          username, // Use username instead of ObjectId
          subjective?.breakPreference, // breakPreference → hobbies (via preferences.breakVibe)
          subjective?.favoriteSnack,   // favoriteSnack → preferences.favoriteSnack
          parseInt(subjective?.screenTimeGoal || "0") || undefined, // screenTimeGoal → screenTimeGoalHours
          parseInt(subjective?.focusSessionLength || "0") || undefined // focusSessionLength → focusSessionLengthMinutes
        );
        logger.info(`User profile updated for ${username} (ObjectId: ${userId}) with quiz data`);
      }
    } catch (updateError) {
      logger.error("Failed to update user profile:", updateError);
      // Continue execution - don't fail the API if profile update fails

    }
    
    return res.json({
      guide: {
        workDuration: guideData.workDuration,
        breakDuration: guideData.breakDuration,
        screenTimeLimit: guideData.screenTimeLimit,
        Exercise: guideData.Exercise || guideData.exercises || []
      }
    });
    
  } catch (error) {
    logger.error("20-20-20 guide generation API error:", error);
    
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error"
    });

  }
};

/**
 * 20-20-20 rule based eye health analysis
 */
function analyze2020Rule(quiz: any[], userProfile: any) {
  // Basic 20-20-20 rule baseline
  const baseline = {
    workDuration: 20, // 20 minutes work
    breakDuration: 60, // 1 minute break
    viewingDistance: 20, // 20 feet (6 meters) distance
    maxDailyScreenTime: 8 // recommended maximum daily screen time (hours)
  };

  // Analyze risk factors from quiz responses
  const screenTimeRisk = analyzeScreenTimeRisk(quiz);
  const eyeStrainLevel = analyzeEyeStrainLevel(quiz);
  const breakHabits = analyzeBreakHabits(quiz);
  
  // Calculate personalized recommendations
  const recommendedScreenTime = Math.max(4, baseline.maxDailyScreenTime - screenTimeRisk);
  const recommendedFocusSession = Math.max(15, baseline.workDuration - eyeStrainLevel * 2);
  const recommendedBreakFrequency = Math.max(15, 60 - breakHabits * 10); // in minutes
  
  return {
    baseline,
    riskFactors: {
      screenTimeRisk,
      eyeStrainLevel,
      breakHabits
    },
    recommendedScreenTime,
    recommendedFocusSession,
    recommendedBreakFrequency,
    overallRiskLevel: (screenTimeRisk + eyeStrainLevel + (3 - breakHabits)) / 3,
    userCurrentHabits: userProfile ? {
      currentScreenTime: userProfile.recentScreenTimes?.slice(-1)[0] || 8,
      currentBlinkRate: userProfile.latestBlinkCount || 15,
      currentBreakSuccess: userProfile.latestBreakSuccessRate || 50
    } : null
  };
}

/**
 * Generate 20-20-20 rule based personalized prompt for LLM
 */
function generate2020Prompt(analysis: any, subjective: any, userProfile: any) {
  const { riskFactors, recommendedScreenTime, recommendedFocusSession, recommendedBreakFrequency } = analysis;
  
  return `
You are an eye health specialist. Please provide a personalized eye health guide based on the 20-20-20 rule (20 minutes work → 1 minute break → 20 feet distance viewing).

Current user status:
- Screen time risk level: ${riskFactors.screenTimeRisk}/3 (higher is more risky)
- Eye strain level: ${riskFactors.eyeStrainLevel}/3 
- Break habits score: ${riskFactors.breakHabits}/3 (higher is better)
- Recommended daily screen time: ${recommendedScreenTime} hours
- Recommended focus session: ${recommendedFocusSession} minutes
- Recommended break frequency: every ${recommendedBreakFrequency} minutes

${userProfile ? `
Existing user data:
- Average blink rate: ${userProfile.latestBlinkCount} blinks/minute
- Break success rate: ${userProfile.latestBreakSuccessRate}%
- Recent screen time: ${userProfile.recentScreenTimes?.slice(-1)[0] || 'N/A'} hours
` : ''}

User preferences:
- Break preference: ${subjective?.breakPreference || 'calm atmosphere'}
- Favorite snack: ${subjective?.favoriteSnack || 'healthy snack'}

Please respond in the following format:
{
  "workDuration": "${recommendedFocusSession} minutes",
  "breakDuration": "1 minute",
  "screenTimeLimit": "${recommendedScreenTime} hours/day",
  "Exercise": [
    "Look at objects 20 feet (6 meters) away",
    "2-3 personalized eye exercises"
  ],
  "personalizedTips": [
    "3-4 personalized advice based on user data"
  ],
  "reasoning": "Personalization reasoning based on 20-20-20 rule"
}
`;
}

/**
 * Generate 20-20-20 rule based fallback guide
 */
function generate2020FallbackGuide(analysis: any, subjective: any) {
  const { recommendedScreenTime, recommendedFocusSession, recommendedBreakFrequency, overallRiskLevel } = analysis;
  
  const exercises = [
    "Look at objects 20 feet (6 meters) away for 1 minute",
    "Blink slowly to relax eye muscles",
    overallRiskLevel > 2 ? "Stretch neck and shoulders to relieve overall tension" : "Move your eyes up, down, left, and right",
    "Cover your eyes with palms and rest for 1 minute"
  ];

  const personalizedTips = [
    `Take a ${recommendedBreakFrequency}-minute break after every ${recommendedFocusSession} minutes of work`,
    `Limit daily screen time to ${recommendedScreenTime} hours`,
    `Set up alarms to automate the 20-20-20 rule`,
    subjective?.breakPreference ? 
      `Create a ${subjective.breakPreference} environment during breaks` : 
      "Create a quiet and comfortable environment during breaks"
  ];

  return {
    workDuration: `${recommendedFocusSession} minutes`,
    breakDuration: "1 minute",
    screenTimeLimit: `${recommendedScreenTime} hours/day`,
    Exercise: exercises.slice(0, 4),
    personalizedTips,
    reasoning: `Adjusted based on the 20-20-20 rule according to your risk level (${overallRiskLevel.toFixed(1)}/3). Protect your eye health with regular breaks.`
  };
}

/**
 * Analyze screen time risk from quiz answers (0-3)
 */
function analyzeScreenTimeRisk(quiz: any[]): number {
  // Analyze screen time related questions
  let risk = 0;
  
  quiz.forEach((q, index) => {
    const answer = q.answer?.toLowerCase() || '';
    
    // Example analysis (adjust according to actual questions)
    if (answer.includes('8 hours') || answer.includes('many') || answer.includes('often')) {
      risk += 1;
    }
    if (answer.includes('10 hours') || answer.includes('very') || answer.includes('always')) {
      risk += 1;
    }
  });
  
  return Math.min(3, risk);
}

/**
 * Analyze eye strain level from quiz answers (0-3)
 */
function analyzeEyeStrainLevel(quiz: any[]): number {
  let strain = 0;
  
  quiz.forEach((q) => {
    const answer = q.answer?.toLowerCase() || '';
    
    if (answer.includes('tired') || answer.includes('hurt') || answer.includes('dry')) {
      strain += 1;
    }
    if (answer.includes('severe') || answer.includes('very') || answer.includes('serious')) {
      strain += 1;
    }
  });
  
  return Math.min(3, strain);
}

/**
 * Analyze break habits from quiz answers (0-3, higher is better)
 */
function analyzeBreakHabits(quiz: any[]): number {
  let habits = 0;
  
  quiz.forEach((q) => {
    const answer = q.answer?.toLowerCase() || '';
    
    if (answer.includes('regular') || answer.includes('often') || answer.includes('good')) {
      habits += 1;
    }
    if (answer.includes('always') || answer.includes('very') || answer.includes('excellent')) {
      habits += 1;
    }
  });
  
  return Math.min(3, habits);
}

/**
 * Calculate risk level per question
 */
function calculateQuestionLevel(answer: string, questionId: number): number {
  const answerLower = answer?.toLowerCase() || '';
  
  // Risk level based on answer content (0: low, 1: medium, 2: high)
  if (answerLower.includes('very') || answerLower.includes('severe') || answerLower.includes('always')) {
    return 2;
  } else if (answerLower.includes('sometimes') || answerLower.includes('normal') || answerLower.includes('occasionally')) {
    return 1;
  } else {
    return 0;
  }
}
