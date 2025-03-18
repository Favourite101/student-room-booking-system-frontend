const BASE_URL = 'http://localhost:8080/api/v1/rooms';

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
  } catch (error) {
    console.error('Error fetching rooms:', error);
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
  } catch (error) {
    console.error('Error fetching room by code:', error);
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
  } catch (error) {
    console.error('Error adding room:', error);
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
  } catch (error) {
    console.error('Error deleting room:', error);
    return null;
  }
};