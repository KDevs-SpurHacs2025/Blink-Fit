const mongoose = require('mongoose');
require('dotenv').config();

// Import models from built files
const UserProfile = require('./lib/models/User').default;

async function checkTestUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Find all users with test emails
    const testUsers = await UserProfile.find({ 
      email: { $in: ['test1@example.com', 'test2@example.com'] } 
    });

    console.log('Found test users:', testUsers.length);
    
    testUsers.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log('- ID:', user._id);
      console.log('- Username:', user.username);
      console.log('- Email:', user.email);
      console.log('- Password Hash:', user.passwordHash ? 'exists' : 'missing');
    });

    // Also check if user can be found by email
    const user1 = await UserProfile.findOne({ email: 'test1@example.com' });
    console.log('\nDirect email search for test1@example.com:');
    console.log('Found:', user1 ? 'YES' : 'NO');
    
    if (user1) {
      console.log('User details:', {
        id: user1._id,
        username: user1.username,
        email: user1.email,
        hasPassword: !!user1.passwordHash
      });
    }

  } catch (error) {
    console.error('Error checking test users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

checkTestUsers();
