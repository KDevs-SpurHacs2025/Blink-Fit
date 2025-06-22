// Browser Console Test for Summary API
// Open browser dev tools (F12) and paste this code

// 1. First, set up test user data in localStorage
localStorage.setItem("user", JSON.stringify({
  id: "6857a2ad842757fd6531632a",
  username: "test1",
  email: "test1@example.com",
  survey: true
}));

// 2. Set up test screen time and break time data
// You can modify these values to test different scenarios
const testScreenTime = 3600; // 1 hour in seconds
const testBreakTime = 1800;   // 30 minutes in seconds

// 3. Test the API call function
async function testSummaryAPI() {
  try {
    // Get user information from localStorage
    const userString = localStorage.getItem("user");
    if (!userString) {
      console.error("No user found in localStorage");
      return false;
    }

    const user = JSON.parse(userString);
    const userId = user.id;

    if (!userId) {
      console.error("No userId found in user data");
      return false;
    }

    // Convert time to hours (seconds → hours)
    const screenTimeHours = testScreenTime / 3600;
    const breakTimeHours = testBreakTime / 3600;

    console.log('🧪 Testing Summary API with data:', {
      userId,
      totalScreenTime: screenTimeHours,
      totalBreakTime: breakTimeHours
    });

    const response = await fetch('https://api-lcq5pbmy4q-pd.a.run.app/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        sessionSummary: {
          totalScreenTime: screenTimeHours,
          totalBreakTime: breakTimeHours
        }
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Session summary sent successfully:', result);
      return true;
    } else {
      const errorText = await response.text();
      console.error('❌ Failed to send session summary:', response.status, errorText);
      return false;
    }
  } catch (error) {
    console.error('💥 Error sending session summary:', error);
    return false;
  }
}

// 4. Run the test
console.log('🚀 Starting Summary API test...');
testSummaryAPI();
