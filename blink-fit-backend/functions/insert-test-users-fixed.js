const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

// Import models from built files
const UserProfile = require('./lib/models/User').default;

async function insertTestUsersWithCorrectHash() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Don't pre-hash password - let the model handle it
    const plainPassword = '1q2w3e';
    console.log('Using plain password "1q2w3e" - model will hash it automatically');

    // Delete existing test users if they exist
    await UserProfile.deleteMany({ 
      email: { $in: ['test1@example.com', 'test2@example.com'] } 
    });
    console.log('Deleted any existing test users');

    // Create test user without quiz responses
    const testUser = new UserProfile({
      username: 'test1',
      email: 'test1@example.com',
      passwordHash: plainPassword, // Use plain password, model will hash it
      latestBlinkCount: 14,
      latestBreakSuccessRate: 85,
      recentScreenTimes: [6, 7, 8, 6.5, 7.5],
      recentBreakTimes: [15, 20, 10, 25, 18],
      preferences: {
        breakVibe: 'relaxing',
        favoriteSnack: 'tea'
      },
      screenTimeGoalHours: 6,
      focusSessionLengthMinutes: 45,
      hobbies: ['Reading', 'Music', 'Walking'],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await testUser.save();
    console.log('Test user created successfully:', {
      id: testUser._id,
      username: testUser.username
    });

    // Create another test user
    const testUser2 = new UserProfile({
      username: 'test2',
      email: 'test2@example.com',
      passwordHash: plainPassword, // Use plain password, model will hash it
      latestBlinkCount: 18,
      latestBreakSuccessRate: 92,
      recentScreenTimes: [5, 6, 7, 5.5, 6.5],
      recentBreakTimes: [20, 15, 30, 25, 20],
      preferences: {
        breakVibe: 'energizing',
        favoriteSnack: 'coffee'
      },
      screenTimeGoalHours: 8,
      focusSessionLengthMinutes: 60,
      hobbies: ['Gaming', 'Coding', 'Movies'],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await testUser2.save();
    console.log('Test user 2 created successfully:', {
      id: testUser2._id,
      username: testUser2.username
    });

    console.log('\n✅ Test users created with model-generated password hash');
    console.log('Password: 1q2w3e');
    console.log('These users should return issurvey: false when logging in');

  } catch (error) {
    console.error('Error inserting test users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

insertTestUsersWithCorrectHash();
