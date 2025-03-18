/* eslint-disable react/prop-types */
//import React from 'react';
import '../css/Room.css';

function Room({ room, handleDeleteClick }) {
  return (
    <div className="room">
      <div className="room-no">{room.roomNo}</div>
      <div className="room-no">{room.roomType}</div>
      <button
        className="delete-room"
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteClick();
        }}
      >
        Delete
      </button>
    </div>
  );
}

export default Room;