const mongoose = require('mongoose');
require('dotenv').config();

// Import models from built files
const UserProfile = require('./lib/models/User').default;

async function checkTestUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Find test users
    const testUsers = await UserProfile.find({ 
      email: { $in: ['test1@example.com', 'test2@example.com'] } 
    });
    
    console.log('Found test users:', testUsers.length);
    testUsers.forEach(user => {
      console.log('User:', {
        id: user._id,
        username: user.username,
        email: user.email,
        hasPasswordHash: !!user.passwordHash
      });
    });

  } catch (error) {
    console.error('Error checking test users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

checkTestUsers();
