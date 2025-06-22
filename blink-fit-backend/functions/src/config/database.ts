import mongoose from 'mongoose';

/**
 * Database configuration for MongoDB Atlas
 */

export const DATABASE_CONFIG = {
  // Connection settings
  CONNECTION_TIMEOUT: 5000,
  SOCKET_TIMEOUT: 45000,
  MAX_POOL_SIZE: 10,
  
  // Database and collection names
  DATABASE_NAME: 'blink-fit-db',
  COLLECTIONS: {
    USER_PROFILES: 'user_profiles',
    QUIZ_RESPONSES: 'quiz_responses',
    GENERATED_GUIDES: 'generated_guides',
    EXERCISE_HISTORY: 'exercise_history'
  }
};

// Database connection state
let isConnected = false;

/**
 * Get MongoDB connection string from environment
 */
export function getMongoConnectionString(): string {
  const connectionString = process.env.MONGODB_URI;
  
  if (!connectionString) {
    throw new Error('MONGODB_URI environment variable is not set');
  }
  
  return connectionString;
}

/**
 * Connect to MongoDB Atlas
 */
export async function connectDB(): Promise<void> {
  if (isConnected) {
    console.log('Already connected to MongoDB');
    return;
  }

  try {
    const connectionString = getMongoConnectionString();
    
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: DATABASE_CONFIG.CONNECTION_TIMEOUT,
      socketTimeoutMS: DATABASE_CONFIG.SOCKET_TIMEOUT,
      maxPoolSize: DATABASE_CONFIG.MAX_POOL_SIZE,
    });

    isConnected = true;
    console.log('Successfully connected to MongoDB Atlas');
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas:', error);
    throw error;
  }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectDB(): Promise<void> {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
}
