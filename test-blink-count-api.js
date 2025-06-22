// Test blink-count API
const axios = require('axios');

const API_BASE_URL = 'https://api-lcq5pbmy4q-pd.a.run.app';
const TEST_USER_ID = '6857a2ad842757fd6531632a'; // test1 user ObjectId

async function testBlinkCountAPI() {
  console.log('🧪 Testing blink-count API...\n');

  try {
    // Test 1: Valid blink count data
    console.log('📊 Test 1: Valid blink count (15 blinks)');
    const response1 = await axios.post(`${API_BASE_URL}/blink-count`, {
      userId: TEST_USER_ID,
      blinkCount: 15
    });

    console.log('✅ Success:', {
      status: response1.status,
      message: response1.data.message,
      success: response1.data.success
    });

    // Test 2: Higher blink count
    console.log('\n📊 Test 2: Higher blink count (25 blinks)');
    const response2 = await axios.post(`${API_BASE_URL}/blink-count`, {
      userId: TEST_USER_ID,
      blinkCount: 25
    });

    console.log('✅ Success:', {
      status: response2.status,
      message: response2.data.message,
      success: response2.data.success
    });

    // Test 3: Low blink count
    console.log('\n📊 Test 3: Low blink count (8 blinks)');
    const response3 = await axios.post(`${API_BASE_URL}/blink-count`, {
      userId: TEST_USER_ID,
      blinkCount: 8
    });

    console.log('✅ Success:', {
      status: response3.status,
      message: response3.data.message,
      success: response3.data.success
    });

    // Test 4: Invalid ObjectId format
    console.log('\n📊 Test 4: Invalid ObjectId format');
    try {
      await axios.post(`${API_BASE_URL}/blink-count`, {
        userId: 'invalid-object-id',
        blinkCount: 15
      });
    } catch (error) {
      console.log('❌ Expected error:', {
        status: error.response?.status,
        message: error.response?.data?.error || error.message
      });
    }

    // Test 5: Missing userId
    console.log('\n📊 Test 5: Missing userId');
    try {
      await axios.post(`${API_BASE_URL}/blink-count`, {
        blinkCount: 15
      });
    } catch (error) {
      console.log('❌ Expected error:', {
        status: error.response?.status,
        message: error.response?.data?.error || error.message
      });
    }

    // Test 6: Invalid blink count (negative)
    console.log('\n📊 Test 6: Invalid blink count (negative)');
    try {
      await axios.post(`${API_BASE_URL}/blink-count`, {
        userId: TEST_USER_ID,
        blinkCount: -5
      });
    } catch (error) {
      console.log('❌ Expected error:', {
        status: error.response?.status,
        message: error.response?.data?.error || error.message
      });
    }

    // Test 7: Invalid blink count (string)
    console.log('\n📊 Test 7: Invalid blink count (string)');
    try {
      await axios.post(`${API_BASE_URL}/blink-count`, {
        userId: TEST_USER_ID,
        blinkCount: "fifteen"
      });
    } catch (error) {
      console.log('❌ Expected error:', {
        status: error.response?.status,
        message: error.response?.data?.error || error.message
      });
    }

    // Test 8: Non-existent user
    console.log('\n📊 Test 8: Non-existent user');
    try {
      await axios.post(`${API_BASE_URL}/blink-count`, {
        userId: '507f1f77bcf86cd799439011', // Valid ObjectId format but doesn't exist
        blinkCount: 15
      });
    } catch (error) {
      console.log('❌ Expected error:', {
        status: error.response?.status,
        message: error.response?.data?.error || error.message
      });
    }

    console.log('\n🎉 Blink-count API tests completed!');

  } catch (error) {
    console.error('💥 Unexpected error during testing:', error.message);
  }
}

// Run the tests
testBlinkCountAPI();
