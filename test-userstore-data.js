// Set test data in userStore for Summary page testing
// Open browser dev tools (F12) and run this in the console while on the app

// 1. Access the userStore (assuming Zustand store is accessible globally)
// You might need to modify this based on how your store is exposed

// Method 1: If you can access the store directly
// You'll need to be on a page where useUserStore is imported

// Method 2: Set data via localStorage and refresh
localStorage.setItem("user", JSON.stringify({
  id: "6857a2ad842757fd6531632a",
  username: "test1",
  email: "test1@example.com",
  survey: true
}));

// Method 3: If you want to test different screen time values
// You can temporarily modify the Summary component to use hardcoded values
// Or add a test button that sets specific values

console.log('Test data set. Navigate to Summary page and test Done button.');

// Method 4: Test data injection function
function injectTestData() {
  // This would need to be run from within the React app context
  const testScreenTime = 7200; // 2 hours
  const testBreakTime = 900;   // 15 minutes
  
  console.log('🧪 Injecting test data:', {
    totalScreenTime: testScreenTime,
    totalBreakTime: testBreakTime
  });
  
  // You would call the store setters here if accessible
  // useUserStore.getState().setTotalScreenTime(testScreenTime);
  // useUserStore.getState().setTotalBreakTime(testBreakTime);
}
