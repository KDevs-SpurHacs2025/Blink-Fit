import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// User preferences interface
export interface UserPreferences {
  breakVibe?: string;      // What's your break-time vibe?
  favoriteSnack?: string;  // Favorite snack during breaks
}

// UserProfile document interface (new schema applied)
export interface IUserProfile extends Document {
  _id: mongoose.Types.ObjectId;
  
  // Login information
  username: string;
  email: string;
  passwordHash: string;

  // Creation/update time
  createdAt: Date;
  updatedAt: Date;

  // User behavior records
  latestBlinkCount: number;          // Recent average blink count (per minute)
  latestBreakSuccessRate: number;    // Recent break solution achievement rate (%)
  recentScreenTimes: number[];       // Recent 7 screen usage times (hours)
  recentBreakTimes: number[];        // Recent 7 break times (minutes)

  // User preference information
  preferences?: UserPreferences;

  // User goals and personal information
  screenTimeGoalHours?: number;      // Screen time goal (hours)
  focusSessionLengthMinutes?: number; // Focus session length (minutes)
  hobbies?: string[];                // Hobbies and interests array

  // Method definitions
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// UserProfile schema definition
const UserProfileSchema: Schema = new Schema({
  // Login information
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true,
    minlength: 6
  },

  // User behavior records
  latestBlinkCount: {
    type: Number,
    default: 15,  // Default: normal blink count
    min: 0,
    max: 100
  },
  latestBreakSuccessRate: {
    type: Number,
    default: 0,   // Default: 0%
    min: 0,
    max: 100
  },
  recentScreenTimes: {
    type: [Number],
    default: [],
    validate: {
      validator: function(arr: number[]) {
        return arr.length <= 7;  // Maximum 7 entries
      },
      message: 'Recent screen times cannot exceed 7 entries'
    }
  },
  recentBreakTimes: {
    type: [Number],
    default: [],
    validate: {
      validator: function(arr: number[]) {
        return arr.length <= 7;  // Maximum 7 entries
      },
      message: 'Recent break times cannot exceed 7 entries'
    }
  },

  // User preference information
  preferences: {
    breakVibe: {
      type: String,
      required: false,
      maxlength: 200
    },
    favoriteSnack: {
      type: String,
      required: false,
      maxlength: 100
    }
  },

  // User goals and personal information
  screenTimeGoalHours: {
    type: Number,
    required: false,
    min: 1,
    max: 24,
    default: 8
  },
  focusSessionLengthMinutes: {
    type: Number,
    required: false,
    min: 5,
    max: 180,
    default: 30
  },
  hobbies: {
    type: [String],
    required: false,
    default: [],
    validate: {
      validator: function(arr: string[]) {
        return arr.length <= 10;  // Maximum 10 entries
      },
      message: 'Hobbies cannot exceed 10 entries'
    }
  }
}, {
  timestamps: true,
  collection: 'user_profiles'
});

// Indexes for better performance
UserProfileSchema.index({ username: 1 });
UserProfileSchema.index({ createdAt: -1 });

// Pre-save middleware to hash password
UserProfileSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash as string, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Password comparison method
UserProfileSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Export the model
export default mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);

// Export for legacy compatibility
export type IUser = IUserProfile;
