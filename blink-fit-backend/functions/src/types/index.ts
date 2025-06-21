// Type definitions for the application

export interface QuizAnswer {
  answer: string;
  level: number;
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
