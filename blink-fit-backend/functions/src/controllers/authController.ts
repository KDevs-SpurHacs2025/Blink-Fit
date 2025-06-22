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
    
    const { username, password } = req.body;
    
    // Input validation
    if (!username || !password) {
      res.status(400).json(createApiResponse(
        false,
        "Username and password are required",
        undefined,
        undefined,
        "Missing required fields"
      ));
      return;
    }
    
    if (typeof username !== 'string' || typeof password !== 'string') {
      res.status(400).json(createApiResponse(
        false,
        "Username and password must be strings",
        undefined,
        undefined,
        "Invalid field types"
      ));
      return;
    }
    
    if (username.trim() === '' || password.trim() === '') {
      res.status(400).json(createApiResponse(
        false,
        "Username and password cannot be empty",
        undefined,
        undefined,
        "Empty fields"
      ));
      return;
    }

    // Ensure database connection
    await connectDB();

    // Authenticate user
    const user = await userRepository.authenticateUser(username.trim(), password);
    
    if (user) {
      // Login successful
      res.json(createApiResponse(
        true,
        "Login successful",
        {
          userId: user._id.toString(), // Return MongoDB ObjectId as string
          username: user.username
        }
      ));
    } else {
      // Login failed
      res.status(401).json(createApiResponse(
        false,
        "Invalid username or password",
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

    // Calculate weekly trend (compare last 7 days vs previous 7 days)
    const calculateWeeklyTrend = (recentTimes: number[]): number => {
      if (recentTimes.length < 7) return 0;
      
      // Get last 7 days average
      const lastWeekAvg = recentTimes.slice(-7).reduce((sum, time) => sum + time, 0) / 7;
      
      // Get previous 7 days average (if available)
      if (recentTimes.length >= 14) {
        const prevWeekAvg = recentTimes.slice(-14, -7).reduce((sum, time) => sum + time, 0) / 7;
        return Number((lastWeekAvg - prevWeekAvg).toFixed(1));
      }
      
      return 0; // Not enough data for comparison
    };

    // Calculate average usage time (most recent entry)
    const averageUsageTime = user.recentScreenTimes && user.recentScreenTimes.length > 0 
      ? user.recentScreenTimes[user.recentScreenTimes.length - 1] 
      : 0;

    // Build response data
    const userData = {
      userId: user._id.toString(), // Use MongoDB ObjectId as string
      username: user.username,
      averageBlink: user.latestBlinkCount || 15,
      recentScreenTimes: user.recentScreenTimes || [],
      averageUsageTime: averageUsageTime,
      weeklyTrend: calculateWeeklyTrend(user.recentScreenTimes || []),
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
