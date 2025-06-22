import { Request, Response } from "express";
import * as logger from "firebase-functions/logger";
import { connectDB } from "../config/database";
import { UserRepository } from "../repositories/UserRepository";
import mongoose from "mongoose";

const userRepository = new UserRepository();

/**
 * POST /api/blink-count - Update user's blink count with simple average
 */
export const updateBlinkCount = async (req: Request, res: Response) => {
  try {
    logger.info("Blink count update API called", { structuredData: true });
    
    const { userId, blinkCount, sessionDuration } = req.body;
    
    // Input validation
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }
    
    if (typeof blinkCount !== 'number' || blinkCount <= 0) {
      return res.status(400).json({ error: "blinkCount must be a positive number" });
    }
    
    if (typeof sessionDuration !== 'number' || sessionDuration <= 0) {
      return res.status(400).json({ error: "sessionDuration must be a positive number" });
    }

    // Database connection
    await connectDB();

    // Update user blink count
    const updatedUser = await userRepository.updateBlinkCount(userId, blinkCount);
    
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    return res.json({
      success: true,
      message: "Blink count updated successfully",
      data: {
        userId: userId,
        newBlinkCount: blinkCount,
        updatedAverage: updatedUser.latestBlinkCount,
        sessionDuration: sessionDuration
      }
    });
    
  } catch (error) {
    logger.error("Blink count update API error:", error);
    
    return res.status(500).json({
      error: "An error occurred while updating blink count"
    });
  }
};