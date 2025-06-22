const mongoose = require('mongoose');
require('dotenv').config();

// Import models from built files
const UserProfile = require('./lib/models/User').default;

async function insertTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Create test user without quiz responses
    const testUser = new UserProfile({
      username: 'test@example.com',
      passwordHash: '$2a$10$8QzVHZfbKpZJgXbJN4DcNOxH9Q3XlZyVzpZwKjvZoQXzHzGvJzGzm', // hashed "test123"
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
      username: 'user2@test.com',
      passwordHash: '$2a$10$8QzVHZfbKpZJgXbJN4DcNOxH9Q3XlZyVzpZwKjvZoQXzHzGvJzGzm', // hashed "test123"
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

    console.log('\n✅ Test users created without quiz_responses');
    console.log('These users should return issurvey: false when logging in');

  } catch (error) {
    console.error('Error inserting test users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

insertTestUser();
