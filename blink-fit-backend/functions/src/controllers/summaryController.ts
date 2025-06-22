import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import mongoose from "mongoose";

const userRepository = new UserRepository();

/**
 * Update user session summary data
 * POST /summary
 */
export const updateSessionSummary = async (req: Request, res: Response) => {
  try {
    const { userId, sessionSummary } = req.body;
    const { totalScreenTime, totalBreakTime, breakCompletionRate } = sessionSummary;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
        timestamp: new Date().toISOString()
      });
    }

    // Validate session data
    if (typeof totalScreenTime !== 'number' || typeof totalBreakTime !== 'number') {
      return res.status(400).json({
        success: false,
        message: "totalScreenTime and totalBreakTime must be numbers",
        timestamp: new Date().toISOString()
      });
    }

    if (totalScreenTime < 0 || totalBreakTime < 0) {
      return res.status(400).json({
        success: false,
        message: "Screen time and break time must be positive numbers",
        timestamp: new Date().toISOString()
      });
    }

    // Validate breakCompletionRate if provided
    if (breakCompletionRate !== undefined) {
      if (typeof breakCompletionRate !== 'number' || breakCompletionRate < 0 || breakCompletionRate > 100) {
        return res.status(400).json({
          success: false,
          message: "breakCompletionRate must be a number between 0 and 100",
          timestamp: new Date().toISOString()
        });
      }
    }

    // Update user session summary
    const updatedUser = await userRepository.updateSessionSummary(
      userId,
      totalScreenTime,
      totalBreakTime,
      breakCompletionRate
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        timestamp: new Date().toISOString()
      });
    }

    // Calculate average values for response
    const averageScreenTime = updatedUser.recentScreenTimes.length > 0 
      ? updatedUser.recentScreenTimes.reduce((a: number, b: number) => a + b, 0) / updatedUser.recentScreenTimes.length 
      : 0;

    const averageBreakTime = updatedUser.recentBreakTimes.length > 0
      ? updatedUser.recentBreakTimes.reduce((a: number, b: number) => a + b, 0) / updatedUser.recentBreakTimes.length
      : 0;

    // Calculate session efficiency (break time / screen time ratio)
    const sessionEfficiency = totalScreenTime > 0 ? (totalBreakTime / totalScreenTime) * 100 : 0;

    return res.status(200).json({
      success: true,
      message: "Session summary updated successfully",
      data: {
        userId: updatedUser._id,
        updatedFields: {
          totalScreenTime,
          totalBreakTime,
          breakCompletionRate: breakCompletionRate !== undefined ? breakCompletionRate : updatedUser.latestBreakSuccessRate,
          sessionEfficiency: Math.round(sessionEfficiency * 100) / 100 // Round to 2 decimal places
        },
        averageStats: {
          averageScreenTime: Math.round(averageScreenTime * 100) / 100,
          averageBreakTime: Math.round(averageBreakTime * 100) / 100,
          totalRecentSessions: updatedUser.recentScreenTimes.length
        },
        recentData: {
          recentScreenTimes: updatedUser.recentScreenTimes,
          recentBreakTimes: updatedUser.recentBreakTimes
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error updating session summary:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      timestamp: new Date().toISOString()
    });
  }
};
