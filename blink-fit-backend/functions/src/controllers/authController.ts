import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { connectDB } from "../config/database";
import { createApiResponse } from "../utils/helpers";

const userRepository = new UserRepository();

/**
 * POST /api/login - User authentication
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Login API called");
    
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
      res.status(400).json(createApiResponse(
        false,
        "Email and password are required",
        undefined,
        undefined,
        "Missing required fields"
      ));
      return;
    }
    
    if (typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json(createApiResponse(
        false,
        "Email and password must be strings",
        undefined,
        undefined,
        "Invalid field types"
      ));
      return;
    }
    
    if (email.trim() === '' || password.trim() === '') {
      res.status(400).json(createApiResponse(
        false,
        "Email and password cannot be empty",
        undefined,
        undefined,
        "Empty fields"
      ));
      return;
    }

    // Ensure database connection
    await connectDB();

    // Authenticate user by email
    const user = await userRepository.authenticateUserByEmail(email.trim(), password);
    
    if (user) {
      // Check if user has completed any quiz responses (using username)
      const hasQuiz = await userRepository.hasQuizResponses(user.username);
      
      // Login successful
      res.json(createApiResponse(
        true,
        "Login successful",
        {
          userId: user._id.toString(), // Return MongoDB ObjectId as string
          username: user.username,
          isSurvey: hasQuiz
        }
      ));
    } else {
      // Login failed
      res.status(401).json(createApiResponse(
        false,
        "Invalid email or password",
        undefined,
        undefined,
        "Authentication failed"
      ));
    }
    
  } catch (error) {
    console.error("Login API error:", error);
    
    res.status(500).json(createApiResponse(
      false,
      "An error occurred during login",
      undefined,
      undefined,
      error instanceof Error ? error.message : "Unknown error"
    ));
  }
};

/**
 * GET /api/user/:userId - Get user profile information
 */
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Get user profile API called");
    
    const { userId } = req.params;
    
    // Input validation
    if (!userId) {
      res.status(400).json(createApiResponse(
        false,
        "User ID is required",
        undefined,
        undefined,
        "Missing user ID parameter"
      ));
      return;
    }
    
    if (typeof userId !== 'string' || userId.trim() === '') {
      res.status(400).json(createApiResponse(
        false,
        "User ID must be a non-empty string",
        undefined,
        undefined,
        "Invalid user ID parameter"
      ));
      return;
    }

    // Ensure database connection
    await connectDB();

    // Find user by ObjectId or username (for backward compatibility)
    let user;
    try {
      // Try to find by ObjectId first (if id looks like ObjectId)
      if (userId.match(/^[0-9a-fA-F]{24}$/)) {
        user = await userRepository.findByUserId(userId);
      } else {
        // Fallback to username search
        user = await userRepository.findByUsername(userId.trim());
      }
    } catch (error) {
      // If ObjectId search fails, try username search
      user = await userRepository.findByUsername(userId.trim());
    }
    
    if (!user) {
      res.status(404).json(createApiResponse(
        false,
        "User not found",
        undefined,
        undefined,
        "User does not exist"
      ));
      return;
    }

    // Calculate weekly trend using LLM analysis
    const calculateWeeklyTrend = async (recentTimes: number[]): Promise<string> => {
      if (recentTimes.length < 7) return "Not enough data for trend analysis";
      
      try {
        // Import GeminiService
        const GeminiService = (await import('../services/geminiService')).default;
        const geminiService = GeminiService.getInstance();
        
        // Prepare trend analysis prompt
        const trendPrompt = `
Analyze the following 7-day screen time trend data (in minutes) and provide a brief trend summary:

Screen time data (oldest to newest): [${recentTimes.slice(-7).join(', ')}]

Respond with ONE clear sentence (10-15 words) describing the overall trend pattern.
Examples: "Screen time shows increasing trend this week", "Usage decreasing after mid-week spike"
        `;

        const trendAnalysis = await geminiService.generateContent(trendPrompt);
        return trendAnalysis?.trim() || "Trend analysis unavailable";
        
      } catch (error) {
        console.log('LLM trend analysis failed, using fallback calculation');
        
        // Fallback: Simple numerical trend
        const lastWeekAvg = recentTimes.slice(-7).reduce((sum, time) => sum + time, 0) / 7;
        
        if (recentTimes.length >= 14) {
          const prevWeekAvg = recentTimes.slice(-14, -7).reduce((sum, time) => sum + time, 0) / 7;
          const change = Number((lastWeekAvg - prevWeekAvg).toFixed(1));
          
          if (change > 10) return "Screen time shows significant increase this week";
          if (change > 0) return "Screen time showing gradual increase";
          if (change < -10) return "Screen time decreased significantly this week";
          if (change < 0) return "Screen time showing gradual decrease";
        }
        
        return "Screen time remains stable this week";
      }
    };

    // Calculate average usage time (actual average of recentScreenTimes)
    const averageUsageTime = user.recentScreenTimes && user.recentScreenTimes.length > 0 
      ? Number((user.recentScreenTimes.reduce((sum, time) => sum + time, 0) / user.recentScreenTimes.length).toFixed(1))
      : 0;

    // Calculate weekly trend analysis
    const weeklyTrend = await calculateWeeklyTrend(user.recentScreenTimes || []);

    // Build response data
    const userData = {
      userId: user._id.toString(), // Use MongoDB ObjectId as string
      username: user.username,
      averageBlink: user.latestBlinkCount || 15,
      recentScreenTimes: user.recentScreenTimes || [],
      recentBreakTimes: user.recentBreakTimes || [],
      averageUsageTime: averageUsageTime,
      weeklyTrend: weeklyTrend,
      screenTimeGoal: user.screenTimeGoalHours || 8,
      focusSessionLength: user.focusSessionLengthMinutes || 60,
      hobbies: user.hobbies || []
    };

    res.json(createApiResponse(
      true,
      "User information retrieved successfully",
      userData
    ));
    
  } catch (error) {
    console.error("Get user profile API error:", error);
    
    res.status(500).json(createApiResponse(
      false,
      "An error occurred while retrieving user information",
      undefined,
      undefined,
      error instanceof Error ? error.message : "Unknown error"
    ));
  }
};
