// Razorpay Configuration
// IMPORTANT: For PRODUCTION, replace test key with live key

export const RAZORPAY_CONFIG = {
  // Test Key - Use for development
  TEST_KEY: 'rzp_test_Ff7Gh4K3JBYwOK',
  
  // Live Key - Replace with your actual live key for production
  // Get from: https://dashboard.razorpay.com/app/keys
  LIVE_KEY: 'rzp_live_YOUR_LIVE_KEY_HERE',
  
  // Environment flag
  IS_PRODUCTION: false, // Set to true when deploying to production
};

// Get the active Razorpay key based on environment
export const getRazorpayKey = () => {
  return RAZORPAY_CONFIG.IS_PRODUCTION 
    ? RAZORPAY_CONFIG.LIVE_KEY 
    : RAZORPAY_CONFIG.TEST_KEY;
};
