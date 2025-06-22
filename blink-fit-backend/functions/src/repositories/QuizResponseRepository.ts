import QuizResponse, { IQuizResponse, IQuizAnswer, ISubjectiveData } from '../models/QuizResponse';
import { v4 as uuidv4 } from 'uuid';

export class QuizResponseRepository {
  /**
   * Create a new quiz response
   */
  async createQuizResponse(
    userId: string,
    responses: IQuizAnswer[],
    subjective: ISubjectiveData
  ): Promise<IQuizResponse> {
    try {
      const sessionId = uuidv4();
      
      const quizResponse = new QuizResponse({
        userId,
        sessionId,
        responses,
        subjective
      });

      await quizResponse.save();
      console.log(`Quiz response created for user ${userId} with session ${sessionId}`);
      return quizResponse;
    } catch (error) {
      console.error('Error creating quiz response:', error);
      throw error;
    }
  }

  /**
   * Find quiz responses by userId
   */
  async findByUserId(userId: string, limit = 10): Promise<IQuizResponse[]> {
    try {
      const responses = await QuizResponse.find({ userId })
        .sort({ submittedAt: -1 })
        .limit(limit);
      
      return responses;
    } catch (error) {
      console.error('Error finding quiz responses by userId:', error);
      throw error;
    }
  }

  /**
   * Find the latest quiz response by userId
   */
  async findLatestByUserId(userId: string): Promise<IQuizResponse | null> {
    try {
      const response = await QuizResponse.findOne({ userId })
        .sort({ submittedAt: -1 });
      
      return response;
    } catch (error) {
      console.error('Error finding latest quiz response:', error);
      throw error;
    }
  }

  /**
   * Find quiz response by sessionId
   */
  async findBySessionId(sessionId: string): Promise<IQuizResponse | null> {
    try {
      const response = await QuizResponse.findOne({ sessionId });
      return response;
    } catch (error) {
      console.error('Error finding quiz response by sessionId:', error);
      throw error;
    }
  }

  /**
   * Get quiz response statistics
   */
  async getQuizStats(): Promise<{
    totalResponses: number;
    uniqueUsers: number;
    responsesToday: number;
    avgResponsesPerUser: number;
  }> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [totalResponses, responsesToday] = await Promise.all([
        QuizResponse.countDocuments(),
        QuizResponse.countDocuments({ submittedAt: { $gte: today } })
      ]);

      // Get unique users count
      const uniqueUsers = await QuizResponse.distinct('userId');
      const avgResponsesPerUser = uniqueUsers.length > 0 ? totalResponses / uniqueUsers.length : 0;

      return {
        totalResponses,
        uniqueUsers: uniqueUsers.length,
        responsesToday,
        avgResponsesPerUser: Math.round(avgResponsesPerUser * 100) / 100
      };
    } catch (error) {
      console.error('Error getting quiz stats:', error);
      throw error;
    }
  }

  /**
   * Get all quiz responses (for admin purposes)
   */
  async getAllQuizResponses(limit = 50): Promise<IQuizResponse[]> {
    try {
      const responses = await QuizResponse.find({})
        .sort({ submittedAt: -1 })
        .limit(limit);
      
      return responses;
    } catch (error) {
      console.error('Error getting all quiz responses:', error);
      throw error;
    }
  }

  /**
   * Delete quiz responses older than specified days
   */
  async deleteOldResponses(daysOld = 90): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await QuizResponse.deleteMany({
        submittedAt: { $lt: cutoffDate }
      });

      console.log(`Deleted ${result.deletedCount} quiz responses older than ${daysOld} days`);
      return result.deletedCount || 0;
    } catch (error) {
      console.error('Error deleting old quiz responses:', error);
      throw error;
    }
  }

  /**
   * Save a comprehensive quiz response with analysis and LLM results
   */
  async saveQuizResponse(data: {
    userId: string;
    responses: Array<{
      questionId: number;
      question: string;
      answer: string;
      level: number;
    }>;
    subjective: {
      breakPreference: string;
      favoriteSnack: string;
      screenTimeGoal: number;
      focusSessionLength: number;
    };
    analysisResults: any;
    llmResponse: any;
    source: string;
  }): Promise<IQuizResponse> {
    try {
      const sessionId = uuidv4();
      
      // Convert to the expected format
      const responses: IQuizAnswer[] = data.responses.map(r => ({
        questionId: r.questionId,
        question: r.question,
        answer: r.answer,
        level: r.level
      }));

      const subjective: ISubjectiveData = {
        screenTimeGoal: data.subjective.screenTimeGoal.toString(),
        focusSessionLength: data.subjective.focusSessionLength.toString(),
        breakPreference: data.subjective.breakPreference,
        favoriteSnack: data.subjective.favoriteSnack
      };

      const quizResponse = new QuizResponse({
        userId: data.userId,
        sessionId,
        responses,
        subjective,
        // Add additional fields for analysis and LLM response if needed
        metadata: {
          analysisResults: data.analysisResults,
          llmResponse: data.llmResponse,
          source: data.source
        }
      });

      await quizResponse.save();
      console.log(`Comprehensive quiz response saved for user ${data.userId} with session ${sessionId}`);
      return quizResponse;
    } catch (error) {
      console.error('Error saving comprehensive quiz response:', error);
      throw error;
    }
  }
}
