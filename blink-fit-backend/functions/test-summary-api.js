// Test Summary API
const axios = require('axios');

const API_BASE_URL = 'https://api-lcq5pbmy4q-pd.a.run.app';
const TEST_USER_ID = '6857a2ad842757fd6531632a'; // test1 user

async function testSummaryAPI() {
  console.log('🧪 Testing Summary API...\n');

  try {
    // Test 1: Valid summary data
    console.log('📊 Test 1: Valid session summary');
    const response1 = await axios.post(`${API_BASE_URL}/summary`, {
      userId: TEST_USER_ID,
      sessionSummary: {
        totalScreenTime: 180, // 3 hours in minutes
        totalBreakTime: 30    // 30 minutes
      }
    });

    console.log('✅ Success:', {
      screenTime: response1.data.data.updatedFields.totalScreenTime,
      breakTime: response1.data.data.updatedFields.totalBreakTime,
      efficiency: response1.data.data.updatedFields.sessionEfficiency + '%',
      averageScreenTime: response1.data.data.averageStats.averageScreenTime,
      totalSessions: response1.data.data.averageStats.totalRecentSessions
    });

    // Test 2: Another session to test array limit
    console.log('\n📊 Test 2: Another session (test array limit)');
    const response2 = await axios.post(`${API_BASE_URL}/summary`, {
      userId: TEST_USER_ID,
      sessionSummary: {
        totalScreenTime: 45,  // 45 minutes
        totalBreakTime: 12    // 12 minutes
      }
    });

    console.log('✅ Success:', {
      recentScreenTimes: response2.data.data.recentData.recentScreenTimes,
      recentBreakTimes: response2.data.data.recentData.recentBreakTimes,
      arrayLength: response2.data.data.recentData.recentScreenTimes.length
    });

    // Test 3: Invalid user ID
    console.log('\n📊 Test 3: Invalid user ID');
    try {
      await axios.post(`${API_BASE_URL}/summary`, {
        userId: 'invalid-id',
        sessionSummary: {
          totalScreenTime: 60,
          totalBreakTime: 10
        }
      });
    } catch (error) {
      console.log('✅ Expected error:', error.response.data.message);
    }

    // Test 4: Missing data
    console.log('\n📊 Test 4: Missing session data');
    try {
      await axios.post(`${API_BASE_URL}/summary`, {
        userId: TEST_USER_ID,
        sessionSummary: {
          totalScreenTime: 60
          // missing totalBreakTime
        }
      });
    } catch (error) {
      console.log('✅ Expected error:', error.response.data.message);
    }

    console.log('\n🎉 All Summary API tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run tests
testSummaryAPI();
