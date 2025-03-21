const BASE_URL = 'https://room-booking-backend-ffbncsabfwf9h8f0.canadacentral-01.azurewebsites.net/api/v1/bookings';

// Process a room booking
export const processBooking = async (bookingRequest) => {
  try {
    const response = await fetch(`${BASE_URL}/book-room`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + localStorage.getItem("accessToken"),
      },
      body: JSON.stringify(bookingRequest),
    });

    if (!response.ok) {
      throw new Error(`Failed to process booking: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error processing booking.');
    throw error;
  }
};

// Fetch daily bookings
export const getDailyBookings = async (date) => {
  try {
    const response = await fetch(`${BASE_URL}/daily?date=${date.toISOString().split('T')[0]}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("accessToken"),
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch daily bookings: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching daily bookings.');
    throw error;
  }
};