import { Request, Response } from "express";
import * as logger from "firebase-functions/logger";
import { createApiResponse } from "../utils/helpers";


/**
 * POST /api/blink-action - Perform a blink action
 */
export const upsertBlinkData = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("Blink Upsert API called", { structuredData: true });
    logger.info("Request body:", req.body);
    const { userId, blinkCount } = req.body;
    if (!userId || typeof blinkCount !== "number") {
        logger.error("Invalid request data", { userId, blinkCount });
        res.status(400).json(createApiResponse(
            false,
            "Invalid request data",
            undefined,
            undefined,
            "userId and blinkNum are required"
        ));
        return; 
    }
    
    // Log the blink data
    console.log(`Received blink data for user ${userId}: ${blinkCount}`);

    // Example response
    res.status(200).json(createApiResponse(
      true,
      "Blink action performed successfully",
    ));
    return; // Explicitly return after sending response
  } catch (error) {
    logger.error("Blink action API error:", error);

    res.status(500).json(createApiResponse(
      false,
      "An error occurred while performing blink action",
      undefined,
      undefined,
      error instanceof Error ? error.message : "Unknown error"
    ));
    return; // Explicitly return after sending response
  }
};