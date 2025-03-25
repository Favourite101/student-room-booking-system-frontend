/* eslint-disable react/prop-types */
import { useState } from 'react';
import '../css/Room.css';

function Room({ room, handleDeleteClick }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className={`room ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="room-header">
                <span className="room-number">{room.roomNo}</span>
                <span className="room-type-badge">{room.roomType}</span>
            </div>
            <div className="room-details">
                <span className="room-capacity">Capacity: {room.capacity || 'N/A'}</span>
            </div>
            <button
                className="delete-button"
                onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick();
                }}
                aria-label={`Delete room ${room.roomNo}`}
            >
                Delete
            </button>
        </div>
    );
}

export default Room;