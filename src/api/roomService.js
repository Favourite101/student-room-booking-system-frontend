const BASE_URL = 'https://room-booking-backend-ffbncsabfwf9h8f0.canadacentral-01.azurewebsites.net/api/v1/rooms';

// Fetch all rooms
export const getRooms = async () => {
  try {
    const response = await fetch(`${BASE_URL}/find-room`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("accessToken"),
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    console.error('Error.');
    return [];
  }
};

// Fetch a room by code
export const getRoomByCode = async (code) => {
  try {
    const response = await fetch(`${BASE_URL}/find-room?code=${code}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("accessToken"),
      }
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    console.error('Error.');
    return null;
  }
};

// Add a new room
export const addRoom = async (roomData) => {
  try {
    const response = await fetch(`${BASE_URL}/add-room`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + localStorage.getItem("accessToken"),
      },
      body: JSON.stringify(roomData),
    });

    if (!response.ok) {
      throw new Error(`Failed to add room: ${response.statusText}`);
    }

    return await response.json();
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    console.error('Error.');
    return null;
  }
};

// Delete a room
export const deleteRoom = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/delete-room/${id}`, {
      method: 'DELETE',
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("accessToken"),
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to delete room: ${response.statusText}`);
    }

    return { success: true };
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    console.error('Error.');
    return null;
  }
};