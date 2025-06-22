import mongoose from 'mongoose';

// User profile interface
export interface UserProfile {
  _id: mongoose.Types.ObjectId;
  
  // Login information
  username: string;              // Login ID (email or unique name)
  passwordHash: string;         // bcrypt encrypted password

  // Creation/update time
  createdAt: Date;
  updatedAt: Date;

  // User behavior records
  latestBlinkCount: number;          // Recent average blink count (per minute)
  latestBreakSuccessRate: number;    // Recent break solution achievement rate (%)
  recentScreenTimes: number[];       // Recent 7 screen usage times (hours)
  recentBreakTimes: number[];        // Recent 7 break times (minutes)

  // User preference information (extracted from latest subjective responses)
  preferences?: {
    breakVibe?: string;              // breakPreference value mapping
    favoriteSnack?: string;          // favoriteSnack value
  };

  // User goals and personal information
  screenTimeGoalHours?: number;      // Screen time goal (hours)
  focusSessionLengthMinutes?: number; // Focus session length (minutes)
  hobbies?: string[];                // Hobbies and interests array
}

// Quiz response interface
export interface QuizResponse {
  _id: mongoose.Types.ObjectId;
  
  userId: string;               // Connected to UserProfile.username
  sessionId: string;            // Session identifier (UUID etc.)
  submittedAt: Date;            // Submission time

  responses: QuizAnswer[];      // 7 multiple choice answers
  subjective: SubjectiveData;   // 4 subjective answers
}

// Quiz answer interface (new API format)
export interface QuizAnswer {
  questionId: number;           // e.g., 1 ~ 7
  answer: string;
  level: number;                // Risk level (0-2)
}

// Subjective data interface (new API format)
export interface SubjectiveData {
  breakPreference: string;             // Break preference ("Sleep", "Exercise", etc.)
  favoriteSnack: string;              // Favorite snack
  focusSessionLength: string;         // Focus session length (string, "1" = 1 hour)
  screenTimeGoal: string;             // Screen time goal (string, "10" = 10 hours)
}

// Existing types maintained for compatibility
export interface GuideData {
  workDuration: string;
  breakDuration: string;
  screenTimeLimit: string;
  Exercise: string[];
}

export interface ExerciseGuide {
  message: string;
  activityType: string;
  duration: string;
  tips: string[];
}

export interface GuideRequest {
  userId: string;
  quiz: QuizAnswer[];
  subjective?: SubjectiveData;
}

export interface ExerciseRequest {
  userPreferences?: string[];
  currentBreakCount?: number;
  workDuration?: number;
}
