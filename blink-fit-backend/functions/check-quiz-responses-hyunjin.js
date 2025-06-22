const mongoose = require('mongoose');
require('dotenv').config();

// Import models from built files
const QuizResponse = require('./lib/models/QuizResponse').default;

async function checkQuizResponses() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Find quiz responses for hyunjin
    const hyunjinResponses = await QuizResponse.find({ userId: 'hyunjin' })
      .sort({ updatedAt: -1 });

    console.log('\n=== HYUNJIN Quiz Responses ===');
    console.log('Found responses:', hyunjinResponses.length);
    
    hyunjinResponses.forEach((response, index) => {
      console.log(`\nResponse ${index + 1}:`);
      console.log('- ID:', response._id);
      console.log('- UserId:', response.userId);
      console.log('- SessionId:', response.sessionId);
      console.log('- Responses count:', response.responses?.length || 0);
      console.log('- Subjective:', response.subjective);
      console.log('- Created:', response.createdAt);
      console.log('- Updated:', response.updatedAt);
    });

    // Check latest response details
    if (hyunjinResponses.length > 0) {
      const latest = hyunjinResponses[0];
      console.log('\n=== LATEST RESPONSE DETAILS ===');
      console.log('Quiz answers:');
      latest.responses?.forEach(r => {
        console.log(`  Q${r.questionId}: ${r.answer}`);
      });
    }

  } catch (error) {
    console.error('Error checking quiz responses:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

checkQuizResponses();
