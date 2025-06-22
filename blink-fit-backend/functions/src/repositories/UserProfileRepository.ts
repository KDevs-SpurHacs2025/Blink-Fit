import UserProfile, { IUser, UserPreferences } from '../models/UserProfile';

export class UserProfileRepository {
  /**
   * Create a new user
   */
  async createUser(
    username: string, 
    password: string, 
    preferences?: UserPreferences
  ): Promise<IUser> {
    try {
      const passwordHash = await (UserProfile as any).hashPassword(password);
      
      const user = new UserProfile({
        username,
        passwordHash,
        preferences,
        latestBlinkCount: 15,
        latestBreakSuccessRate: 0,
        recentScreenTimes: [],
        recentBreakTimes: []
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
  async findByUsername(username: string): Promise<IUser | null> {
    try {
      return await UserProfile.findOne({ username: username.toLowerCase() });
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  /**
   * Update user's behavior data from quiz response
   */
  async updateFromQuizResponse(
    username: string,
    screenTimeGoal: number,
    focusSessionLength: number,
    preferences: UserPreferences
  ): Promise<IUser | null> {
    try {
      const user = await UserProfile.findOneAndUpdate(
        { username: username.toLowerCase() },
        {
          $set: { 
            preferences,
            updatedAt: new Date()
          },
          $push: {
            recentScreenTimes: {
              $each: [screenTimeGoal],
              $slice: -7  // Keep only last 7 entries
            },
            recentBreakTimes: {
              $each: [focusSessionLength],
              $slice: -7  // Keep only last 7 entries
            }
          }
        },
        { new: true }
      );

      if (user) {
        console.log(`User ${username} updated from quiz response`);
      }

      return user;
    } catch (error) {
      console.error('Error updating user from quiz:', error);
      throw error;
    }
  }

  /**
   * Update user's activity metrics
   */
  async updateActivityMetrics(
    username: string,
    blinkCount?: number,
    breakSuccessRate?: number
  ): Promise<IUser | null> {
    try {
      const updateData: any = { updatedAt: new Date() };
      
      if (blinkCount !== undefined) {
        updateData.latestBlinkCount = blinkCount;
      }
      
      if (breakSuccessRate !== undefined) {
        updateData.latestBreakSuccessRate = Math.max(0, Math.min(100, breakSuccessRate));
      }

      const user = await UserProfile.findOneAndUpdate(
        { username: username.toLowerCase() },
        { $set: updateData },
        { new: true }
      );

      if (user) {
        console.log(`User ${username} activity metrics updated`);
      }

      return user;
    } catch (error) {
      console.error('Error updating activity metrics:', error);
      throw error;
    }
  }

  /**
   * Get all users (for testing/admin)
   */
  async getAllUsers(): Promise<IUser[]> {
    try {
      return await UserProfile.find({}, '-passwordHash'); // Exclude password hash
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  /**
   * Delete user (for testing)
   */
  async deleteUser(username: string): Promise<boolean> {
    try {
      const result = await UserProfile.deleteOne({ username: username.toLowerCase() });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}
