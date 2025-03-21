import { useState, useEffect } from 'react';
import { getRooms, getRoomByCode, addRoom, deleteRoom } from '../api/roomService';
import Room from '../components/Room';
import SuccessMessage from '../components/SuccessMessage'; // Import SuccessMessage
import ErrorMessage from '../components/ErrorMessage'; // Import ErrorMessage
import '../css/ManageRooms.css';
import { Link } from 'react-router-dom';

function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newRoom, setNewRoom] = useState({
    roomNo: '',
    roomType: '', // Default to empty
  });
  const [success, setSuccess] = useState(null); // State for success message
  const [error, setError] = useState(null); // State for error message

  // Fetch rooms on component mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms();
        setRooms(data);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        console.log('Error.');
      }
    };
    fetchRooms();
  }, []);

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const data = await getRoomByCode(searchQuery);
      if (data) {
        setRooms(data);
      } else {
        setError('No room found!');
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError('Search failed. Please try again.');
      console.log('Error.');
    }
  };

  // Handle input change for new room
  const handleInputChange = (e) => {
    setNewRoom({ ...newRoom, [e.target.name]: e.target.value });
  };

  // Validate room number format (e.g., E21, F09)
  const validateRoomNumber = (roomNo) => {
    const regex = /^[A-Za-z]\d{2}$/; // Letter followed by two digits
    return regex.test(roomNo);
  };

  // Handle adding a new room
  const handleAddRoom = async (e) => {
    e.preventDefault();

    // Validate room number format
    if (!validateRoomNumber(newRoom.roomNo)) {
      setError('Room number must be a letter followed by two numbers (e.g., E21, F09).');
      return;
    }

    try {
      const data = await addRoom(newRoom);
      if (data) {
        setRooms([...rooms, data]);
        setShowAddModal(false);
        setNewRoom({ roomNo: '', roomType: '' }); // Reset form
        setError('');
        setSuccess('Room added successfully!');
      } else {
        setError('Failed to add room. Please try again.');
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError('Error adding room. Please try again.');
      console.log('Error.');
    }
  };

  // Handle delete button click
  const handleDeleteClick = (room) => {
    setSelectedRoom(room);
    setShowDeleteModal(true);
  };

  // Handle confirming delete
  const handleConfirmDelete = async () => {
    if (!selectedRoom) return;
    try {
      await deleteRoom(selectedRoom.id);
      setRooms(rooms.filter((b) => b.id !== selectedRoom.id));
      setShowDeleteModal(false);
      setError('');
      setSuccess('Room deleted successfully!');
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError('Error deleting room. Please try again.');
      console.log('Error.');
    }
  };

  // Close the delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedRoom(null);
  };

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="manage-rooms">
      {/* Display Success Message */}
      {success && <SuccessMessage message={success} />}

      {/* Display Error Message */}
      {error && <ErrorMessage message={error} />}

      {/* Search Form */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="Search for rooms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {/* Rooms Grid */}
      <div className="rooms-grid">
        {rooms.length > 0 ? (
          rooms.map((room, index) => (
            <Room
              key={index}
              room={room}
              handleDeleteClick={() => handleDeleteClick(room)}
            />
          ))
        ) : (
          <p className="no-rooms">No rooms found...</p>
        )}

        {/* Add Room Button */}
        <Link onClick={() => setShowAddModal(true)} className="add-room">
          +
        </Link>
      </div>

      {/* Add Room Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Room</h2>
            <br />
            <form onSubmit={handleAddRoom}>
              <input
                type="text"
                name="roomNo"
                className="search-input"
                placeholder="Room Number (e.g., E21, F09)"
                value={newRoom.roomNo}
                onChange={handleInputChange}
                required
              />
              <select
                name="roomType"
                className="search-input"
                value={newRoom.roomType}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select Room Type</option>
                <option value="Classic">Classic</option>
                <option value="Premium">Premium</option>
                <option value="Regular">Regular</option>
              </select>
              <br />
              <br />
              <button type="submit">Add Room</button>
              <br />
              <br />
            </form>
            <button onClick={() => setShowAddModal(false)} className="close-button">Close</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedRoom && (
        <div className="modal-overlay">
          <div className="edit-delete-modal-content">
            <h2>Are you sure?</h2>
            <p>Do you want to delete room: <strong>{selectedRoom.roomNo}</strong>?</p>
            <br />
            <button onClick={handleConfirmDelete} className="delete">
              Yes, Delete
            </button>
            <button onClick={closeDeleteModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageRooms;