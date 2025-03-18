import { useState, useEffect } from 'react';
import { getRooms, getRoomByCode, addRoom, deleteRoom } from '../api/roomService';
import Room from '../components/Room';
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
    roomType: '',
  });

  // Fetch rooms on component mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms();
        setRooms(data);
      } catch (error) {
        console.log('Error fetching rooms:', error);
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
        console.log('No room found!');
      }
    } catch (error) {
      console.log('Search failed:', error);
    }
  };

  // Handle input change for new room
  const handleInputChange = (e) => {
    setNewRoom({ ...newRoom, [e.target.name]: e.target.value });
  };

  // Handle adding a new room
  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const data = await addRoom(newRoom);
      if (data) {
        setRooms([...rooms, data]);
        setShowAddModal(false);
        setNewRoom({ roomCode: '' });
      } else {
        console.log('Failed to add room.');
      }
    } catch (error) {
      console.log('Error adding room:', error);
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
    } catch (error) {
      console.log('Error deleting room:', error);
    }
  };

  // Close the delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedRoom(null);
  };

  return (
    <div className="manage-rooms">
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
                placeholder="Room Number"
                value={newRoom.roomNo}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="roomType"
                className="search-input"
                placeholder="Room Type"
                value={newRoom.roomType}
                onChange={handleInputChange}
                required
              />
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
            <p>Do you want to delete the room with code: <strong>{selectedRoom.roomCode}</strong>?</p>
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