const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models from built files
const UserProfile = require('./lib/models/User').default;

async function testAuthentication() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Test finding user by email
    const user = await UserProfile.findOne({ email: 'test1@example.com' });
    console.log('User found by email:', user ? {
      id: user._id,
      username: user.username,
      email: user.email,
      hasPasswordHash: !!user.passwordHash
    } : 'No user found');

    if (user) {
      // Test password comparison
      const isValidPassword = await user.comparePassword('1q2w3e');
      console.log('Password validation result:', isValidPassword);
      
      // Manual bcrypt compare
      const manualCompare = await bcrypt.compare('1q2w3e', user.passwordHash);
      console.log('Manual bcrypt compare:', manualCompare);
    }

    // Also test existing user
    console.log('\n--- Testing existing user ---');
    const existingUser = await UserProfile.findOne({ email: 'hyunjin@example.com' });
    console.log('Existing user found:', existingUser ? {
      id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      hasPasswordHash: !!existingUser.passwordHash
    } : 'No user found');

    if (existingUser) {
      // Test password comparison for existing user
      console.log('Testing password for existing user...');
      try {
        const isValidPassword = await existingUser.comparePassword('1q2w3e');
        console.log('Existing user password validation result:', isValidPassword);
      } catch (error) {
        console.log('Error testing existing user password:', error.message);
      }
    }

  } catch (error) {
    console.error('Error during authentication test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testAuthentication();
