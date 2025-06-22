import mongoose, { Schema, Document } from 'mongoose';

// Quiz answer interface (new API format)
export interface IQuizAnswer {
  questionId: number;
  answer: string;
  level: number;
}

// Subjective data interface (new API format)
export interface ISubjectiveData {
  breakPreference: string;
  favoriteSnack: string;
  focusSessionLength: string;
  screenTimeGoal: string;
}

// Quiz response document interface
export interface IQuizResponse extends Document {
  _id: string;
  userId: string;
  sessionId: string;
  submittedAt: Date;
  responses: IQuizAnswer[];
  subjective: ISubjectiveData;
}

// Quiz answer sub-schema (new API format)
const QuizAnswerSchema = new Schema({
  questionId: {
    type: Number,
    required: true,
    min: 1,
    max: 7
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: Number,
    required: true,
    min: 0,
    max: 2
  }
}, { _id: false });

// Subjective data sub-schema (new API format)
const SubjectiveDataSchema = new Schema({
  breakPreference: {
    type: String,
    required: true,
    trim: true
  },
  favoriteSnack: {
    type: String,
    required: true,
    trim: true
  },
  focusSessionLength: {
    type: String,
    required: true,
    trim: true
  },
  screenTimeGoal: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

// Quiz response schema
const QuizResponseSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true,
    trim: true,
    lowercase: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  submittedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  responses: {
    type: [QuizAnswerSchema],
    required: true,
    validate: [responsesLimit, 'Quiz must have exactly 7 responses']
  },
  subjective: {
    type: SubjectiveDataSchema,
    required: true
  }
}, {
  timestamps: true,
  collection: 'quiz_responses'
});

// Validator for responses array
function responsesLimit(val: IQuizAnswer[]) {
  return val.length === 7;
}

// Indexes for better performance
QuizResponseSchema.index({ userId: 1, submittedAt: -1 });
QuizResponseSchema.index({ sessionId: 1 });

// Export the model
export default mongoose.model<IQuizResponse>('QuizResponse', QuizResponseSchema);
