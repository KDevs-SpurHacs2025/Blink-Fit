import mongoose from 'mongoose';

class DatabaseService {
  private static instance: DatabaseService;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async initialize(connectionString: string): Promise<boolean> {
    try {
      if (this.isConnected) {
        console.log("Database already connected");
        return true;
      }

      const options: mongoose.ConnectOptions = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        retryWrites: true,
      };

      await mongoose.connect(connectionString, options);
      
      this.isConnected = true;
      console.log("MongoDB Atlas connected successfully");
      
      // 연결 이벤트 리스너
      mongoose.connection.on('error', (error) => {
        console.error('MongoDB connection error:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected');
        this.isConnected = true;
      });

      return true;
    } catch (error) {
      console.error('MongoDB connection failed:', error);
      this.isConnected = false;
      return false;
    }
  }

  public isDbConnected(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log("MongoDB disconnected successfully");
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
    }
  }

  public getConnection(): typeof mongoose.connection {
    return mongoose.connection;
  }
}

export default DatabaseService;
