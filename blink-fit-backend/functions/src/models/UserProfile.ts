import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// User preferences interface
export interface UserPreferences {
  breakVibe?: string;
  favoriteSnack?: string;
}

// User document interface
export interface IUser extends Document {
  _id: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  
  // 사용자 행동 기록
  latestBlinkCount: number;
  latestBreakSuccessRate: number;
  recentScreenTimes: number[];
  recentBreakTimes: number[];
  
  // 사용자 선호 정보
  preferences?: UserPreferences;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// User schema definition
const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  latestBlinkCount: {
    type: Number,
    default: 15,  // 정상적인 평균 깜빡임 수
    min: 0
  },
  latestBreakSuccessRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  recentScreenTimes: {
    type: [Number],
    default: [],
    validate: [arrayLimit, '{PATH} exceeds the limit of 7']
  },
  recentBreakTimes: {
    type: [Number],
    default: [],
    validate: [arrayLimit, '{PATH} exceeds the limit of 7']
  },
  preferences: {
    breakVibe: {
      type: String,
      required: false
    },
    favoriteSnack: {
      type: String,
      required: false
    }
  }
}, {
  timestamps: true,
  collection: 'users'
});

// Array limit validator
function arrayLimit(val: number[]) {
  return val.length <= 7;
}

// Indexes for better performance
UserSchema.index({ username: 1 });
UserSchema.index({ updatedAt: -1 });

// Password comparison method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Static method to hash password
UserSchema.statics.hashPassword = async function(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

// Export the model
export default mongoose.model<IUser>('User', UserSchema);
