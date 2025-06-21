import { GuideData, ExerciseGuide, SubjectiveData } from "../types";

/**
 * Generate fallback guide when Gemini is not available
 */
export function generateFallbackGuide(quizLevels: number[], subjective?: SubjectiveData): GuideData {
  // Calculate risk level based on quiz levels
  const riskScore = quizLevels.reduce((sum, level) => sum + level, 0);
  
  // Determine risk level and recommendations
  let workDuration: string;
  let breakDuration: string;
  let screenTimeLimit: string;
  let exercises: string[];
  
  if (riskScore <= 10) {
    workDuration = "45 minutes";
    breakDuration = "10 minutes";
    screenTimeLimit = "7 hours/day";
    exercises = [
      "20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds",
      "Blink exercises: Close eyes for 2 seconds, then open and blink rapidly 10 times",
      "Eye circles: Slowly move your eyes in circular motions",
      "Focus shifting: Alternate between near and far objects"
    ];
  } else if (riskScore <= 15) {
    workDuration = "30 minutes";
    breakDuration = "8 minutes";
    screenTimeLimit = "6 hours/day";
    exercises = [
      "20-20-20 rule with extended breaks",
      "Palming: Cover eyes with palms for 30 seconds to relax",
      "Figure-8 tracking: Trace imaginary figure-8 with your eyes",
      "Near-far focusing with conscious blinking"
    ];
  } else {
    workDuration = "25 minutes";
    breakDuration = "7 minutes";
    screenTimeLimit = "5 hours/day";
    exercises = [
      "Frequent 20-20-20 breaks every 15 minutes",
      "Eye massage: Gently massage temples and around eyes",
      "Complete eye rest: Close eyes for 1-2 minutes frequently",
      "Distance focusing with slow, deliberate blinking"
    ];
  }
  
  // Incorporate user preferences if available
  if (subjective?.breakPreference && subjective.breakPreference.toLowerCase().includes('stretch')) {
    exercises.push("Combine eye exercises with gentle neck and shoulder stretching");
  }
  if (subjective?.favoriteSnack && subjective.favoriteSnack.toLowerCase().includes('coffee')) {
    exercises.push("Take coffee breaks while practicing distance focusing");
  }
  if (subjective?.favoritePlace && subjective.favoritePlace.toLowerCase().includes('window')) {
    exercises.push("Use window views for distance focusing exercises");
  }
  
  return {
    workDuration,
    breakDuration,
    screenTimeLimit,
    Exercise: exercises.slice(0, 4) // Limit to 4 exercises
  };
}

/**
 * Generate fallback exercise guide when Gemini is not available
 */
export function generateFallbackExercise(userPreferences?: string[], breakCount?: number): ExerciseGuide {
  const exercises: ExerciseGuide[] = [
    {
      message: "Close your eyes for a moment and take a deep breath. Then look at something far outside for 20 seconds to relieve eye strain.",
      activityType: "eye_exercise",
      duration: "2-3",
      tips: ["Blink consciously", "Also stretch your neck and shoulders"]
    },
    {
      message: "Stand up and do some light stretching. Turn your neck left and right, shrug your shoulders to improve circulation.",
      activityType: "physical_movement", 
      duration: "3-5",
      tips: ["Move slowly", "Also drink a glass of water"]
    },
    {
      message: "Close your eyes for a moment and listen to relaxing music or nature sounds to calm your mind. Both your eyes and mind need rest.",
      activityType: "relaxation",
      duration: "5",
      tips: ["Try deep breathing", "Gently massage your eyes with your palms"]
    }
  ];
  
  // Select exercise based on break count
  let selectedExercise = exercises[(breakCount || 1) % exercises.length];
  
  // Apply preferences if available
  if (userPreferences && userPreferences.length > 0) {
    const preferences = userPreferences.join(' ').toLowerCase();
    if (preferences.includes('tea') || preferences.includes('coffee') || preferences.includes('drink')) {
      selectedExercise = {
        ...selectedExercise,
        message: `Prepare your favorite beverage while looking outside. ${selectedExercise.message}`
      };
    }
    if (preferences.includes('music')) {
      selectedExercise = {
        ...selectedExercise,
        message: `With your favorite music, ${selectedExercise.message}`
      };
    }
  }
  
  return selectedExercise;
}

/**
 * Create standardized API response
 */
export function createApiResponse<T>(
  success: boolean = true,
  message?: string,
  data?: T,
  source?: string,
  error?: string
) {
  return {
    success,
    message,
    data,
    timestamp: new Date().toISOString(),
    source,
    error
  };
}

/**
 * Validate quiz data
 */
export function validateQuizData(userId: string, quiz: any[]): { isValid: boolean; error?: string } {
  if (!userId) {
    return { isValid: false, error: "userId is required" };
  }
  
  if (!quiz || !Array.isArray(quiz)) {
    return { isValid: false, error: "quiz must be an array" };
  }
  
  if (quiz.length !== 7) {
    return { isValid: false, error: "quiz must contain exactly 7 answers" };
  }
  
  for (let i = 0; i < quiz.length; i++) {
    const item = quiz[i];
    if (!item.hasOwnProperty('answer') || !item.hasOwnProperty('level')) {
      return { isValid: false, error: `quiz[${i}] must have 'answer' and 'level' properties` };
    }
  }
  
  return { isValid: true };
}
