import { Request, Response } from "express";
import GeminiService from "../services/geminiService";
import { createApiResponse } from "../utils/helpers";
import { HelloRequest } from "../types";

const geminiService = GeminiService.getInstance();

/**
 * Basic health check endpoint
 */
export const healthCheck = (req: Request, res: Response) => {
  res.json({ message: "Firebase Functions v2 server is running!" });
};

/**
 * GET /api/hello - Generate greeting message
 */
export const getHello = async (req: Request, res: Response) => {
  try {
    console.info("Hello API called", { structuredData: true });
    
    const { name } = req.query;
    const userName = (name as string) || "anonymous user";
    
    if (geminiService.isAvailable()) {
      try {
        const geminiMessage = await geminiService.generateGreeting(userName);
        
        res.json(createApiResponse(
          true,
          geminiMessage,
          { userName },
          "Gemini AI"
        ));
      } catch (error) {
        console.error("Gemini API error:", error);
        // Fallback to default message
        const fallbackMessage = name ? 
          `Hello, ${name}! Welcome to Eye-Shield. Let's protect your eye health together!` : 
          "Hello! Welcome to Eye-Shield. Let's protect your eye health together!";
        
        res.json(createApiResponse(
          true,
          fallbackMessage,
          { userName },
          "Fallback",
          "Temporary Gemini API error"
        ));
      }
    } else {
      // Initialize Gemini and try again
      geminiService.initialize();
      
      const fallbackMessage = name ? 
        `Hello, ${name}! Welcome to Eye-Shield. Let's protect your eye health together!` : 
        "Hello! Welcome to Eye-Shield. Let's protect your eye health together!";
      
      res.json(createApiResponse(
        true,
        fallbackMessage,
        { userName },
        "Fallback (Gemini disabled)"
      ));
    }
    
  } catch (error) {
    console.error("Hello API error:", error);
    res.status(500).json(createApiResponse(
      false,
      "Internal server error",
      undefined,
      undefined,
      error instanceof Error ? error.message : "Unknown error"
    ));
  }
};

/**
 * POST /api/hello - Generate conversation response
 */
export const postHello = async (req: Request, res: Response) => {
  try {
    console.info("Hello POST API called", { structuredData: true });
    
    const { name, message: userMessage }: HelloRequest = req.body;
    const userName = name || "anonymous user";
    
    if (geminiService.isAvailable()) {
      try {
        const geminiResponse = await geminiService.generateConversationResponse(
          userName, 
          userMessage || 'Hello'
        );
        
        res.json(createApiResponse(
          true,
          geminiResponse,
          { 
            userName, 
            userMessage: userMessage || "none",
            received: req.body 
          },
          "Gemini AI"
        ));
      } catch (error) {
        console.error("Gemini API error:", error);
        // Fallback response
        const fallbackMessage = `Hello, ${userName}! Message: ${userMessage || "none"} - Eye-Shield will protect your eye health!`;
        
        res.json(createApiResponse(
          true,
          fallbackMessage,
          { 
            userName, 
            userMessage: userMessage || "none",
            received: req.body 
          },
          "Fallback",
          "Temporary Gemini API error"
        ));
      }
    } else {
      // Initialize Gemini and use fallback
      geminiService.initialize();
      
      const fallbackMessage = `Hello, ${userName}! Message: ${userMessage || "none"} - Eye-Shield will protect your eye health!`;
      
      res.json(createApiResponse(
        true,
        fallbackMessage,
        { 
          userName, 
          userMessage: userMessage || "none",
          received: req.body 
        },
        "Fallback (Gemini disabled)"
      ));
    }
    
  } catch (error) {
    console.error("Hello POST API error:", error);
    res.status(500).json(createApiResponse(
      false,
      "Internal server error",
      undefined,
      undefined,
      error instanceof Error ? error.message : "Unknown error"
    ));
  }
};
