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
          userId: user.username, // Using username as userId for consistency
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
