import { GoogleGenerativeAI } from "@google/generative-ai";
import { getEnvironment, GEMINI_CONFIG } from "../config";
import { GuideData } from "../types";
import { QuizAnswer, SubjectiveData } from "../types/database";

class GeminiService {
  private static instance: GeminiService;
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  public initialize(): boolean {
    if (this.isInitialized) {
      return true;
    }

    try {
      const { googleApiKey } = getEnvironment();

      if (googleApiKey) {
        this.genAI = new GoogleGenerativeAI(googleApiKey);
        this.model = this.genAI.getGenerativeModel({ 
          model: GEMINI_CONFIG.model,
          generationConfig: {
            temperature: GEMINI_CONFIG.temperature,
            maxOutputTokens: GEMINI_CONFIG.maxOutputTokens,
          }
        });
        this.isInitialized = true;
        console.info("Gemini API initialization successful");
        return true;
      } else {
        console.warn("GOOGLE_API_KEY not set. Running in fallback mode.");
        return false;
      }
    } catch (error) {
      console.error("Gemini API initialization failed:", error);
      return false;
    }
  }

  public isAvailable(): boolean {
    return this.isInitialized && this.model !== null;
  }

  public async generateContent(prompt: string): Promise<string> {
    if (!this.isAvailable()) {
      this.initialize();
    }

    if (!this.model) {
      throw new Error("Gemini model not available");
    }

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Gemini content generation failed:", error);
      throw error;
    }
  }

  public async generateGreeting(userName: string): Promise<string> {
    const prompt = `Hello! Please write a warm and friendly greeting for ${userName}. 
    Welcome them to the Eye-Shield service and include an encouraging message about eye health management. 
    Please write 2-3 sentences concisely.`;

    return this.generateContent(prompt);
  }

  public async generateConversationResponse(userName: string, userMessage: string): Promise<string> {
    const prompt = `User "${userName}" sent the following message: "${userMessage}"
    
    As an AI assistant for the Eye-Shield eye health management service, please provide a warm and helpful response. 
    Please naturally include advice or encouragement related to eye health. Answer in 2-3 sentences.`;

    return this.generateContent(prompt);
  }

  public async generateGuide(userId: string, quiz: QuizAnswer[], subjective?: SubjectiveData): Promise<GuideData> {
    // Question templates for mapping questionId to readable text
    const questionTemplates = [
      'Vision device usage',
      'Eye conditions',
      'Eye fatigue frequency', 
      'Daily screen time',
      'Break habits',
      'Light sensitivity',
      'Headaches/blurred vision'
    ];

    const prompt = `
You are an eye health specialist AI assistant. Please analyze the user's quiz responses and generate a personalized guide.

**User ID:** ${userId}

**Quiz Responses:**
1. ${questionTemplates[0]}: ${quiz[0]?.answer || 'Not provided'} (Risk Level: ${quiz[0]?.level || 0})
2. ${questionTemplates[1]}: ${quiz[1]?.answer || 'Not provided'} (Risk Level: ${quiz[1]?.level || 0})
3. ${questionTemplates[2]}: ${quiz[2]?.answer || 'Not provided'} (Risk Level: ${quiz[2]?.level || 0})
4. ${questionTemplates[3]}: ${quiz[3]?.answer || 'Not provided'} (Risk Level: ${quiz[3]?.level || 0})
5. ${questionTemplates[4]}: ${quiz[4]?.answer || 'Not provided'} (Risk Level: ${quiz[4]?.level || 0})
6. ${questionTemplates[5]}: ${quiz[5]?.answer || 'Not provided'} (Risk Level: ${quiz[5]?.level || 0})
7. ${questionTemplates[6]}: ${quiz[6]?.answer || 'Not provided'} (Risk Level: ${quiz[6]?.level || 0})

**Personal Preferences:**
- Screen time goal: ${subjective?.screenTimeGoal || 'Not provided'} hours
- Focus session length: ${subjective?.focusSessionLength || 'Not provided'} hours
- Break preference: ${subjective?.breakPreference || 'Not provided'}
- Favorite snack: ${subjective?.favoriteSnack || 'Not provided'}

Please respond with the following JSON format based on the comprehensive information above:

{
  "workDuration": "number with unit (e.g., '25 minutes')",
  "breakDuration": "number with unit (e.g., '7 minutes')", 
  "screenTimeLimit": "number with unit (e.g., '5 hours/day')",
  "Exercise": ["exercise1", "exercise2", "exercise3"]
}

Please provide safe and practical recommendations based on medical evidence. Include 3-4 specific eye exercises that are suitable for the user's condition and preferences.
`;

    const response = await this.generateContent(prompt);
    
    // Try to parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("JSON format not found in Gemini response");
    }
  }

  public async generate2020Guide(prompt: string, analysis: any): Promise<any> {
    if (!this.isInitialized) {
      throw new Error("Gemini service not initialized");
    }

    const response = await this.generateContent(prompt);
    
    // Try to parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("JSON format not found in Gemini response");
    }
  }

  public async generateExerciseGuide(userPreferences?: string[], currentBreakCount?: number, workDuration?: number): Promise<any> {
    const prompt = `
You are Eye-Shield's friendly AI assistant. Please generate a personalized exercise guide suitable for the user's break time.

**User Information:**
- Personal preferences: ${userPreferences ? userPreferences.join(', ') : 'No specific preferences'}
- Current break count: ${currentBreakCount || 1} time(s)
- Work duration: ${workDuration || 'Unknown'} minutes

**Requirements:**
1. Write concisely in 2-3 sentences
2. Naturally reflect user preferences
3. Suggest specific activities beneficial for eye health
4. Use a warm and encouraging tone
5. Provide different suggestions each time (prevent repetition)

Please respond in the following JSON format:

{
  "message": "personalized exercise guide message",
  "activityType": "eye_exercise/physical_movement/relaxation/combination",
  "duration": "recommended time (minutes)",
  "tips": ["specific tip1", "specific tip2"]
}

Examples:
- If user likes "drinking tea" → suggest brewing tea while looking out the window
- If user likes "listening to music" → suggest neck and shoulder stretching with music
`;

    const response = await this.generateContent(prompt);
    
    // Try to parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("JSON format not found in Gemini response");
    }
  }
}

export default GeminiService;
