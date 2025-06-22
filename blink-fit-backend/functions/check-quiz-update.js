const mongoose = require('mongoose');
require('dotenv').config();

// Import models from built files
const QuizResponse = require('./lib/models/QuizResponse').default;

async function checkQuizResponseUpdate() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Check quiz response for hyunjin user
    const hyunjinQuiz = await QuizResponse.findOne({ userId: 'hyunjin' });
    console.log('\nQuiz response for hyunjin user:');
    
    if (hyunjinQuiz) {
      console.log('✅ Found quiz response (should be updated)');
      console.log('- Session ID:', hyunjinQuiz.sessionId);
      console.log('- Submitted At:', hyunjinQuiz.submittedAt);
      console.log('- Updated At:', hyunjinQuiz.updatedAt);
      console.log('- Subjective breakPreference:', hyunjinQuiz.subjective.breakPreference);
    } else {
      console.log('❌ No quiz response found for hyunjin user');
    }

    // Check quiz response for test1 user
    const test1Quiz = await QuizResponse.findOne({ userId: 'test1' });
    console.log('\nQuiz response for test1 user:');
    
    if (test1Quiz) {
      console.log('✅ Found quiz response (should be newly created)');
      console.log('- Session ID:', test1Quiz.sessionId);
      console.log('- Submitted At:', test1Quiz.submittedAt);
      console.log('- Created At:', test1Quiz.createdAt);
      console.log('- Subjective breakPreference:', test1Quiz.subjective.breakPreference);
      console.log('- Subjective favoriteSnack:', test1Quiz.subjective.favoriteSnack);
    } else {
      console.log('❌ No quiz response found for test1 user');
    }

    // Also check total quiz responses count
    const totalQuizResponses = await QuizResponse.countDocuments();
    console.log(`\nTotal quiz responses in database: ${totalQuizResponses}`);

  } catch (error) {
    console.error('Error checking quiz responses:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

checkQuizResponseUpdate();
