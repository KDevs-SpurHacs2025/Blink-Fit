const mongoose = require('mongoose');
require('dotenv').config();

// Import models from built files
const UserProfile = require('./lib/models/User').default;

async function checkAllUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Find all users to see their ObjectIds and usernames
    const allUsers = await UserProfile.find({}).select('_id username email');
    
    console.log('All users in database:');
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ObjectId: ${user._id}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email || 'N/A'}`);
      console.log('');
    });

    // Specifically check the ObjectId you mentioned
    const specificUser = await UserProfile.findById('6857309cebdcc56a334ac0d6');
    console.log('User with ObjectId 6857309cebdcc56a334ac0d6:');
    if (specificUser) {
      console.log('- Username:', specificUser.username);
      console.log('- Email:', specificUser.email || 'N/A');
    } else {
      console.log('- NOT FOUND');
    }

    // Also check hyunjin user
    const hyunjinUser = await UserProfile.findOne({ username: 'hyunjin' });
    console.log('\nUser with username "hyunjin":');
    if (hyunjinUser) {
      console.log('- ObjectId:', hyunjinUser._id);
      console.log('- Email:', hyunjinUser.email || 'N/A');
    } else {
      console.log('- NOT FOUND');
    }

  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

checkAllUsers();
