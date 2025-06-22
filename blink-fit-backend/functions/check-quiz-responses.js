const mongoose = require('mongoose');
require('dotenv').config();

// Import models from built files
const QuizResponse = require('./lib/models/QuizResponse').default;
const UserProfile = require('./lib/models/User').default;

async function checkQuizResponses() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Check chris user
    const chrisUser = await UserProfile.findOne({ username: 'chris' });
    console.log('Chris user:', {
      id: chrisUser?._id,
      username: chrisUser?.username,
      email: chrisUser?.email
    });

    if (chrisUser) {
      // Check quiz responses for chris
      const quizResponses = await QuizResponse.find({ userId: chrisUser._id.toString() });
      console.log(`Quiz responses for chris (${chrisUser._id}):`, quizResponses.length);
      
      if (quizResponses.length > 0) {
        console.log('First quiz response:', quizResponses[0]);
      }

      // Also check by string comparison
      const quizResponsesStr = await QuizResponse.find({ userId: chrisUser._id });
      console.log(`Quiz responses (ObjectId comparison):`, quizResponsesStr.length);
    }

    // List all quiz responses to see the format
    const allQuizResponses = await QuizResponse.find({}).limit(5);
    console.log('\nAll quiz responses (first 5):');
    allQuizResponses.forEach((quiz, index) => {
      console.log(`${index + 1}. userId: ${quiz.userId} (type: ${typeof quiz.userId})`);
    });

  } catch (error) {
    console.error('Error checking quiz responses:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

checkQuizResponses();
