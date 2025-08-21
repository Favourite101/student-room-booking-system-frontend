const BASE_URL = 'https://room-booking-backend-ffbncsabfwf9h8f0.canadacentral-01.azurewebsites.net/api/v1/bookings';

// Helper function to get auth headers
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
});

// Legacy Endpoints (existing functionality)
export const processBooking = async (bookingRequest) => {
  try {
    const response = await fetch(`${BASE_URL}/book-room`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingRequest),
    });

    if (!response.ok) {
      throw new Error(`Failed to process booking: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error processing booking:', error);
    throw error;
  }
};

export const getDailyBookings = async (date) => {
  try {
    const response = await fetch(`${BASE_URL}/daily?date=${date.toISOString().split('T')[0]}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch daily bookings: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching daily bookings:', error);
    throw error;
  }
};

// ENHANCED ENDPOINTS FOR GOLDMAN SACHS SHOWCASE

/**
 * SMART BOOKING - AI-Powered Room Booking with Optimization Algorithms
 * This is the flagship feature showcasing intelligent room allocation
 */
export const processSmartBooking = async (bookingRequest) => {
  try {
    const response = await fetch(`${BASE_URL}/smart-book`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ...bookingRequest,
        useRecommendationEngine: true, // Enable AI recommendations
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Smart booking failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error processing smart booking:', error);
    throw error;
  }
};

/**
 * RECOMMENDATION ENGINE - Get AI-powered room suggestions
 * Showcases machine learning algorithms for optimal room selection
 */
export const getRoomRecommendations = async (bookingRequest) => {
  try {
    const response = await fetch(`${BASE_URL}/recommendations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ...bookingRequest,
        useRecommendationEngine: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get recommendations: ${response.statusText}`);
    }

    const recommendations = await response.json();
    
    // Return empty array if no recommendations instead of null
    return Array.isArray(recommendations) ? recommendations : [];
  } catch (error) {
    console.error('Error fetching room recommendations:', error);
    throw error;
  }
};

/**
 * CONFLICT ANALYSIS - Advanced booking conflict detection and resolution
 * Demonstrates predictive analytics and conflict resolution algorithms
 */
export const analyzeBookingConflicts = async (bookingRequest) => {
  try {
    const response = await fetch(`${BASE_URL}/analyze-conflicts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingRequest),
    });

    if (!response.ok) {
      throw new Error(`Failed to analyze conflicts: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing booking conflicts:', error);
    throw error;
  }
};

/**
 * ROOM UTILIZATION ANALYTICS - Individual room performance metrics
 * Shows data analytics and business intelligence capabilities
 */
export const getRoomAnalytics = async (roomId) => {
  try {
    const response = await fetch(`${BASE_URL}/analytics/room/${roomId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch room analytics: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching room analytics:', error);
    throw error;
  }
};

/**
 * SYSTEM OPTIMIZATION METRICS - Enterprise-level performance dashboard
 * Demonstrates system-wide analytics and KPI tracking
 */
export const getSystemOptimizationMetrics = async () => {
  try {
    const response = await fetch(`${BASE_URL}/analytics/system`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch system metrics: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching system metrics:', error);
    throw error;
  }
};

// UTILITY FUNCTIONS FOR ENHANCED FEATURES

/**
 * Get comprehensive booking insights - combines multiple endpoints
 * Perfect for executive dashboard views
 */
export const getBookingInsights = async (bookingRequest) => {
  try {
    const [recommendations, conflicts, systemMetrics] = await Promise.allSettled([
      getRoomRecommendations(bookingRequest),
      analyzeBookingConflicts(bookingRequest),
      getSystemOptimizationMetrics(),
    ]);

    return {
      recommendations: recommendations.status === 'fulfilled' ? recommendations.value : [],
      conflicts: conflicts.status === 'fulfilled' ? conflicts.value : null,
      systemMetrics: systemMetrics.status === 'fulfilled' ? systemMetrics.value : null,
      hasErrors: [recommendations, conflicts, systemMetrics].some(result => result.status === 'rejected'),
    };
  } catch (error) {
    console.error('Error fetching booking insights:', error);
    throw error;
  }
};

/**
 * Batch room analytics - get analytics for multiple rooms
 * Useful for facility management dashboards
 */
export const getBatchRoomAnalytics = async (roomIds) => {
  try {
    const promises = roomIds.map(roomId => 
      getRoomAnalytics(roomId).catch(error => ({
        roomId,
        error: error.message,
      }))
    );

    return await Promise.all(promises);
  } catch (error) {
    console.error('Error fetching batch room analytics:', error);
    throw error;
  }
};

/**
 * Enhanced booking workflow - complete smart booking process
 * 1. Get recommendations
 * 2. Analyze conflicts
 * 3. Process smart booking
 */
export const executeEnhancedBookingWorkflow = async (bookingRequest) => {
  try {
    // Step 1: Get AI recommendations
    console.log('🤖 Getting AI-powered room recommendations...');
    const recommendations = await getRoomRecommendations(bookingRequest);

    // Step 2: Analyze potential conflicts
    console.log('🔍 Analyzing booking conflicts...');
    const conflictAnalysis = await analyzeBookingConflicts(bookingRequest);

    // Step 3: Process smart booking if no critical conflicts
    console.log('⚡ Processing smart booking...');
    const bookingResult = await processSmartBooking(bookingRequest);

    return {
      success: true,
      recommendations,
      conflictAnalysis,
      bookingResult,
      workflow: {
        step1: 'Recommendations Retrieved',
        step2: 'Conflicts Analyzed',
        step3: 'Smart Booking Processed',
        completedAt: new Date().toISOString(),
      }
    };
  } catch (error) {
    console.error('Enhanced booking workflow failed:', error);
    return {
      success: false,
      error: error.message,
      workflow: {
        failed: true,
        errorAt: new Date().toISOString(),
      }
    };
  }
};

// Export all services for easy importing
export const BookingService = {
  // Legacy
  processBooking,
  getDailyBookings,
  
  // Enhanced Goldman Sachs Features
  processSmartBooking,
  getRoomRecommendations,
  analyzeBookingConflicts,
  getRoomAnalytics,
  getSystemOptimizationMetrics,
  
  // Utility Functions
  getBookingInsights,
  getBatchRoomAnalytics,
  executeEnhancedBookingWorkflow,
};