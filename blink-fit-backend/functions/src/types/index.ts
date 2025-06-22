// Type definitions for the application

// Database related types
export interface UserPreferences {
  breakVibe?: string;                // What's your break-time vibe?
  favoriteSnack?: string;           // Favorite snack during breaks
}

export interface UserProfile {
  _id?: string;
  username: string;                 // Login ID (email or unique name)
  passwordHash: string;            // bcrypt encrypted password
  createdAt: Date;
  updatedAt: Date;
  
  // User behavior records
  latestBlinkCount: number;         // Recent average blink count (per minute)
  latestBreakSuccessRate: number;   // Recent break solution achievement rate (%)
  recentScreenTimes: number[];      // Recent 7 screen usage times (hours)
  recentBreakTimes: number[];       // Recent 7 break times (minutes)
  
  // User preference information
  preferences?: UserPreferences;
}

export interface NewQuizAnswer {
  questionId: number;               // e.g., 1 ~ 7
  question: string;
  answer: string;
}

export interface NewSubjectiveData {
  screenTimeGoalHours: number;         // Screen time goal (hours)
  focusSessionLengthMinutes: number;   // Focus session length (minutes)
  breakVibe: string;                   // Break atmosphere description
  favoriteSnack: string;              // Favorite snack
}

export interface NewQuizResponse {
  _id?: string;
  userId: string;                   // UserProfile.username과 연결
  sessionId: string;                // 세션 식별자
  submittedAt: Date;                // 제출 시간
  responses: NewQuizAnswer[];       // 객관식 7개
  subjective: NewSubjectiveData;    // 주관식 4개
}

// Type definitions for the application

export interface QuizAnswer {
  answer: string;
}

export interface SubjectiveData {
  breakPreference?: string;
  favoriteSnack?: string;
  favoritePlace?: string;
}

export interface GuideData {
  workDuration: string;
  breakDuration: string;
  screenTimeLimit: string;
  Exercise: string[];
}

export interface ExerciseGuide {
  message: string;
  activityType: 'eye_exercise' | 'physical_movement' | 'relaxation' | 'combination';
  duration: string;
  tips: string[];
}

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  timestamp: string;
  source?: string;
  error?: string;
}

export interface HelloRequest {
  name?: string;
  message?: string;
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
