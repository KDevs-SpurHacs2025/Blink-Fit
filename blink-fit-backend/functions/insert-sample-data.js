// Script to insert sample users into MongoDB Atlas
const mongoose = require('mongoose');
const { default: UserProfile } = require('./lib/models/User.js');
const { default: QuizResponse } = require('./lib/models/QuizResponse.js');
const { v4: uuidv4 } = require('uuid');

// Load environment variables
require('dotenv').config();

async function insertSampleData() {
  try {
    // Connect to MongoDB Atlas
    const connectionString = process.env.MONGODB_URI;
    if (!connectionString) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(connectionString);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await UserProfile.deleteMany({});
    await QuizResponse.deleteMany({});
    console.log('✅ Existing data cleared');

    // Sample users data with plain text passwords (will be hashed automatically)
    const sampleUsers = [
      {
        username: 'eunie',
        passwordHash: '1q2w3e', // will be hashed by pre-save middleware
        latestBlinkCount: 14,
        latestBreakSuccessRate: 80,
        recentScreenTimes: [7, 6.5, 8, 7.5, 6],
        recentBreakTimes: [8, 12, 10, 9, 7],
        screenTimeGoalHours: 6,
        focusSessionLengthMinutes: 45,
        hobbies: 'I love listening to classical music, reading novels, and practicing yoga. I also enjoy cooking healthy meals and spending time in nature.',
        preferences: {
          breakVibe: 'I enjoy peaceful music and stretching during breaks',
          favoriteSnack: 'Matcha latte and cookies'
        }
      },
      {
        username: 'jay',
        passwordHash: '1q2w3e', // will be hashed
        latestBlinkCount: 16,
        latestBreakSuccessRate: 75,
        recentScreenTimes: [9, 8, 10, 9.5, 8.5],
        recentBreakTimes: [5, 8, 6, 10, 12],
        screenTimeGoalHours: 8,
        focusSessionLengthMinutes: 25,
        hobbies: 'I am passionate about photography, hiking, and playing basketball. I also enjoy podcasts about technology and entrepreneurship.',
        preferences: {
          breakVibe: 'Quick walks and fresh air help me reset',
          favoriteSnack: 'Energy bars and orange juice'
        }
      },
      {
        username: 'chris',
        passwordHash: '1q2w3e', // will be hashed
        latestBlinkCount: 11,
        latestBreakSuccessRate: 90,
        recentScreenTimes: [6, 5.5, 7, 6.5, 5],
        recentBreakTimes: [15, 18, 12, 20, 14],
        screenTimeGoalHours: 5,
        focusSessionLengthMinutes: 60,
        hobbies: 'I love gaming, watching anime, and building mechanical keyboards. I also enjoy learning new programming languages and contributing to open source projects.',
        preferences: {
          breakVibe: 'I prefer meditation and deep breathing exercises',
          favoriteSnack: 'Herbal tea and nuts'
        }
      },
      {
        username: 'hyunjin',
        passwordHash: '1q2w3e', // will be hashed
        latestBlinkCount: 20,
        latestBreakSuccessRate: 60,
        recentScreenTimes: [11, 10, 12, 11.5, 9.5],
        recentBreakTimes: [3, 5, 4, 6, 8],
        screenTimeGoalHours: 10,
        focusSessionLengthMinutes: 20,
        hobbies: 'I enjoy drawing digital art, playing video games, and listening to K-pop music. I also like watching movies and creating short videos for social media.',
        preferences: {
          breakVibe: 'Short gaming breaks and social media scrolling',
          favoriteSnack: 'Iced coffee and chocolate'
        }
      }
    ];

    // Insert users
    console.log('📝 Inserting sample users...');
    for (let i = 0; i < sampleUsers.length; i++) {
      const userData = sampleUsers[i];
      
      const user = new UserProfile(userData);
      await user.save();
      console.log(`✅ Created user: ${userData.username} (password: ${userData.passwordHash})`);
    }

    // Sample quiz responses
    const sampleQuizResponses = [
      {
        userId: 'eunie',
        responses: [
          { questionId: 1, question: 'How often do you experience eye strain?', answer: 'Sometimes' },
          { questionId: 2, question: 'How many hours do you spend on screens daily?', answer: '6-8 hours' },
          { questionId: 3, question: 'Do you take regular breaks from screen time?', answer: 'Yes, regularly' },
          { questionId: 4, question: 'How is your sleep quality?', answer: 'Good' },
          { questionId: 5, question: 'Do you use blue light filters?', answer: 'Yes' },
          { questionId: 6, question: 'How often do you blink while working?', answer: 'Normal rate' },
          { questionId: 7, question: 'Do you experience headaches?', answer: 'Rarely' }
        ],
        subjective: {
          screenTimeGoalHours: 6,
          focusSessionLengthMinutes: 45,
          breakVibe: 'I enjoy peaceful music and stretching during breaks',
          favoriteSnack: 'Matcha latte and cookies'
        }
      },
      {
        userId: 'jay',
        responses: [
          { questionId: 1, question: 'How often do you experience eye strain?', answer: 'Often' },
          { questionId: 2, question: 'How many hours do you spend on screens daily?', answer: '8+ hours' },
          { questionId: 3, question: 'Do you take regular breaks from screen time?', answer: 'Sometimes' },
          { questionId: 4, question: 'How is your sleep quality?', answer: 'Fair' },
          { questionId: 5, question: 'Do you use blue light filters?', answer: 'No' },
          { questionId: 6, question: 'How often do you blink while working?', answer: 'Less than normal' },
          { questionId: 7, question: 'Do you experience headaches?', answer: 'Sometimes' }
        ],
        subjective: {
          screenTimeGoalHours: 8,
          focusSessionLengthMinutes: 60,
          breakVibe: 'Quick walks and fresh air help me reset',
          favoriteSnack: 'Energy bars and orange juice'
        }
      },
      {
        userId: 'chris',
        responses: [
          { questionId: 1, question: 'How often do you experience eye strain?', answer: 'Rarely' },
          { questionId: 2, question: 'How many hours do you spend on screens daily?', answer: '4-6 hours' },
          { questionId: 3, question: 'Do you take regular breaks from screen time?', answer: 'Yes, very regularly' },
          { questionId: 4, question: 'How is your sleep quality?', answer: 'Excellent' },
          { questionId: 5, question: 'Do you use blue light filters?', answer: 'Yes' },
          { questionId: 6, question: 'How often do you blink while working?', answer: 'Normal rate' },
          { questionId: 7, question: 'Do you experience headaches?', answer: 'Never' }
        ],
        subjective: {
          screenTimeGoalHours: 5,
          focusSessionLengthMinutes: 90,
          breakVibe: 'I prefer meditation and deep breathing exercises',
          favoriteSnack: 'Herbal tea and nuts'
        }
      },
      {
        userId: 'hyunjin',
        responses: [
          { questionId: 1, question: 'How often do you experience eye strain?', answer: 'Very often' },
          { questionId: 2, question: 'How many hours do you spend on screens daily?', answer: '10+ hours' },
          { questionId: 3, question: 'Do you take regular breaks from screen time?', answer: 'Rarely' },
          { questionId: 4, question: 'How is your sleep quality?', answer: 'Poor' },
          { questionId: 5, question: 'Do you use blue light filters?', answer: 'Sometimes' },
          { questionId: 6, question: 'How often do you blink while working?', answer: 'Much less than normal' },
          { questionId: 7, question: 'Do you experience headaches?', answer: 'Often' }
        ],
        subjective: {
          screenTimeGoalHours: 8,
          focusSessionLengthMinutes: 25,
          breakVibe: 'Short gaming breaks and social media scrolling',
          favoriteSnack: 'Iced coffee and chocolate'
        }
      }
    ];

    // Insert quiz responses
    console.log('📝 Inserting sample quiz responses...');
    for (let i = 0; i < sampleQuizResponses.length; i++) {
      const quizData = sampleQuizResponses[i];
      
      const quizResponse = new QuizResponse({
        ...quizData,
        sessionId: uuidv4()
      });
      
      await quizResponse.save();
      console.log(`✅ Created quiz response for: ${quizData.userId}`);
    }

    console.log('🎉 Sample data insertion completed!');
    
    // Display summary
    const userCount = await UserProfile.countDocuments();
    const quizCount = await QuizResponse.countDocuments();
    
    console.log(`\n📊 Database Summary:`);
    console.log(`   👥 Total Users: ${userCount}`);
    console.log(`   📝 Total Quiz Responses: ${quizCount}`);

    // Display user credentials for testing
    console.log(`\n🔑 User Credentials for Testing:`);
    console.log(`   eunie / eunie123!`);
    console.log(`   jay / jay456secure`);
    console.log(`   chris / chris789pass`);
    console.log(`   hyunjin / hyunjin2024!`);

  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
insertSampleData();
