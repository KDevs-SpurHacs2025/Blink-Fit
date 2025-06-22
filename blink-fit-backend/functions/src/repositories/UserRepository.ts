import UserProfile, { IUserProfile, UserPreferences } from '../models/User';

export class UserRepository {
  /**
   * Create a new user with username and password
   */
  async createUser(username: string, password: string, preferences?: UserPreferences): Promise<IUserProfile> {
    try {
      const existingUser = await UserProfile.findOne({ username });
      if (existingUser) {
        throw new Error('Username already exists');
      }

      const user = new UserProfile({
        username,
        passwordHash: password, // will be hashed by pre-save middleware
        preferences: preferences || {}
      });

      await user.save();
      console.log(`User ${username} created successfully`);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Find user by username
   */
  async findByUsername(username: string): Promise<IUserProfile | null> {
    try {
      const user = await UserProfile.findOne({ username });
      return user;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  /**
   * Authenticate user with username and password
   */
  async authenticateUser(username: string, password: string): Promise<IUserProfile | null> {
    try {
      const user = await UserProfile.findOne({ username });
      if (!user) {
        return null;
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw error;
    }
  }

  /**
   * Authenticate user with email and password
   */
  async authenticateUserByEmail(email: string, password: string): Promise<IUserProfile | null> {
    try {
      // First try to find by email field
      let user = await UserProfile.findOne({ email: email });
      
      // If not found, try to find by username field (for backward compatibility)
      if (!user) {
        user = await UserProfile.findOne({ username: email });
      }
      
      if (!user) {
        return null;
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error authenticating user by email:', error);
      throw error;
    }
  }

  /**
   * Update user preferences and behavior data
   */
  async updateUserData(
    username: string, 
    updates: {
      preferences?: UserPreferences;
      latestBlinkCount?: number;
      latestBreakSuccessRate?: number;
      newScreenTime?: number;
      newBreakTime?: number;
      screenTimeGoalHours?: number;
      focusSessionLengthMinutes?: number;
      hobbies?: string;
    }
  ): Promise<IUserProfile | null> {
    try {
      const user = await UserProfile.findOne({ username });
      if (!user) {
        return null;
      }

      // Update preferences
      if (updates.preferences) {
        user.preferences = { ...user.preferences, ...updates.preferences };
      }

      // Update behavior data
      if (typeof updates.latestBlinkCount === 'number') {
        user.latestBlinkCount = updates.latestBlinkCount;
      }

      if (typeof updates.latestBreakSuccessRate === 'number') {
        user.latestBreakSuccessRate = updates.latestBreakSuccessRate;
      }

      // Add new screen time (maintain maximum 7 entries)
      if (typeof updates.newScreenTime === 'number') {
        user.recentScreenTimes.push(updates.newScreenTime);
        if (user.recentScreenTimes.length > 7) {
          user.recentScreenTimes = user.recentScreenTimes.slice(-7);
        }
      }

      // Add new break time (maintain maximum 7 entries)
      if (typeof updates.newBreakTime === 'number') {
        user.recentBreakTimes.push(updates.newBreakTime);
        if (user.recentBreakTimes.length > 7) {
          user.recentBreakTimes = user.recentBreakTimes.slice(-7);
        }
      }

      // Update goal and personal information
      if (typeof updates.screenTimeGoalHours === 'number') {
        user.screenTimeGoalHours = updates.screenTimeGoalHours;
      }

      if (typeof updates.focusSessionLengthMinutes === 'number') {
        user.focusSessionLengthMinutes = updates.focusSessionLengthMinutes;
      }

      if (Array.isArray(updates.hobbies)) {
        user.hobbies = updates.hobbies;
      } else if (typeof updates.hobbies === 'string') {
        // Convert string to array if needed for backwards compatibility
        user.hobbies = [updates.hobbies];
      }

      await user.save();
      console.log(`User ${username} data updated successfully`);
      return user;
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  }

  /**
   * Update user preferences from quiz data
   */
  async updatePreferencesFromQuiz(username: string, breakVibe?: string, favoriteSnack?: string): Promise<IUserProfile | null> {
    try {
      const user = await UserProfile.findOne({ username });
      if (!user) {
        return null;
      }

      const preferences: UserPreferences = { ...user.preferences };
      
      if (breakVibe) {
        preferences.breakVibe = breakVibe;
      }
      
      if (favoriteSnack) {
        preferences.favoriteSnack = favoriteSnack;
      }

      user.preferences = preferences;
      await user.save();

      console.log(`User ${username} preferences updated from quiz`);
      return user;
    } catch (error) {
      console.error('Error updating user preferences from quiz:', error);
      throw error;
    }
  }

  /**
   * Update user preferences and goals from quiz data (new API format)
   */
  async updateUserFromQuiz(
    username: string, 
    breakPreference?: string, 
    favoriteSnack?: string,
    screenTimeGoalHours?: number,
    focusSessionLengthMinutes?: number
  ): Promise<IUserProfile | null> {
    try {
      const user = await UserProfile.findOne({ username });
      if (!user) {
        return null;
      }

      // Update preferences
      const preferences: UserPreferences = { ...user.preferences };
      
      if (breakPreference) {
        preferences.breakVibe = breakPreference;
        // Also add to hobbies array (breakPreference → hobbies mapping)
        const currentHobbies = user.hobbies || [];
        if (!currentHobbies.includes(breakPreference)) {
          user.hobbies = [...currentHobbies, breakPreference];
        }
      }
      
      if (favoriteSnack) {
        preferences.favoriteSnack = favoriteSnack;
      }

      user.preferences = preferences;

      // Update goals
      if (typeof screenTimeGoalHours === 'number') {
        user.screenTimeGoalHours = screenTimeGoalHours;
      }

      if (typeof focusSessionLengthMinutes === 'number') {
        user.focusSessionLengthMinutes = focusSessionLengthMinutes;
      }

      await user.save();
      console.log(`User ${username} updated from quiz: preferences and goals`);
      return user;
    } catch (error) {
      console.error('Error updating user from quiz:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<{ totalUsers: number; recentUsers: number }> {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const [totalUsers, recentUsers] = await Promise.all([
        UserProfile.countDocuments(),
        UserProfile.countDocuments({ updatedAt: { $gte: sevenDaysAgo } })
      ]);

      return { totalUsers, recentUsers };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  /**
   * Get all users (for admin purposes)
   */
  async getAllUsers(): Promise<IUserProfile[]> {
    try {
      const users = await UserProfile.find({}).select('-passwordHash').sort({ createdAt: -1 });
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  // Methods for legacy compatibility
  async createOrUpdateUser(userId: string, preferences?: UserPreferences): Promise<IUserProfile> {
    const existingUser = await this.updateUserData(userId, { preferences });
    if (existingUser) {
      return existingUser;
    }
    return this.createUser(userId, 'defaultPassword', preferences);
  }

  async findByUserId(userId: string): Promise<IUserProfile | null> {
    try {
      // Try to find by MongoDB ObjectId first
      const user = await UserProfile.findById(userId);
      return user;
    } catch (error) {
      console.error("Error finding user by ID:", error);
      return null;
    }
  }

  async updatePreferences(userId: string, preferences: UserPreferences): Promise<IUserProfile | null> {
    return this.updateUserData(userId, { preferences });
  }

  /**
   * Update user blink count with simple average calculation
   */
  async updateBlinkCount(userId: string, newBlinkCount: number): Promise<IUserProfile | null> {
    try {
      const user = await UserProfile.findById(userId);
      if (!user) {
        return null;
      }

      // Simple average: (existing average + new value) / 2
      const currentAverage = user.latestBlinkCount || 0;
      const newAverage = currentAverage === 0 ? newBlinkCount : (currentAverage + newBlinkCount) / 2;
      
      user.latestBlinkCount = Math.round(newAverage * 100) / 100; // Round to 2 decimal places
      user.updatedAt = new Date();

      await user.save();
      console.log(`User ${userId} blink count updated: ${currentAverage} -> ${user.latestBlinkCount}`);
      return user;
    } catch (error) {
      console.error('Error updating user blink count:', error);
      throw error;
    }
  }

  /**
   * Check if user has completed any quiz responses
   * Note: quiz_responses collection uses username as userId, not ObjectId
   */
  async hasQuizResponses(username: string): Promise<boolean> {
    try {
      const QuizResponse = require('../models/QuizResponse').default;
      const quizCount = await QuizResponse.countDocuments({ userId: username });
      console.log(`Checking quiz responses for username: ${username}, count: ${quizCount}`);
      return quizCount > 0;
    } catch (error) {
      console.error('Error checking quiz responses:', error);
      return false;
    }
  }

  /**
   * Find user by ObjectId
   */
  async findById(userId: string): Promise<IUserProfile | null> {
    try {
      const user = await UserProfile.findById(userId);
      return user;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  /**
   * Update user session summary (recentScreenTimes and recentBreakTimes)
   */
  async updateSessionSummary(
    userId: string, 
    totalScreenTime: number, 
    totalBreakTime: number
  ): Promise<IUserProfile | null> {
    try {
      // Update using MongoDB's $push with $slice to maintain only the latest 7 entries
      const updatedUser = await UserProfile.findByIdAndUpdate(
        userId,
        {
          $push: {
            recentScreenTimes: {
              $each: [totalScreenTime],
              $slice: -7  // Keep only the latest 7 entries
            },
            recentBreakTimes: {
              $each: [totalBreakTime],
              $slice: -7  // Keep only the latest 7 entries
            }
          },
          $set: {
            updatedAt: new Date()
          }
        },
        { 
          new: true, // Return the updated document
          runValidators: true
        }
      );

      if (updatedUser) {
        console.log(`Session summary updated for user ${userId}: screen=${totalScreenTime}, break=${totalBreakTime}`);
      }
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating session summary:', error);
      throw error;
    }
  }
}
