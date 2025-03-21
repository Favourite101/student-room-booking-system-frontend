/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import "../css/Student.css";

function Student({ student, handleEditClick }) {
    const defaultImageUrl = "../../public/swap.jpeg";
    const defaultRoomNo = "nil";
    const [imageUrl, setImageUrl] = useState(defaultImageUrl);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                if (student.imageUrl) {
                    const response = await fetch(student.imageUrl, {
                        headers: {
                            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch image');
                    }

                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    setImageUrl(url);
                }
                // eslint-disable-next-line no-unused-vars
            } catch (error) {
                console.error('Error.');
            }
        };

        fetchImage();
    }, [student.imageUrl]);

    return (
        <div className="student">
            <div className="student-image">
                <img src={imageUrl} alt={student.name} />
            </div>
            <div className="student-info">
                <h3>{student.name}</h3>
                <h5>{student.matricNo}</h5>
                <h5>Current Room: {student.currentRoom ? student.currentRoom.roomNo : defaultRoomNo}</h5>
                <button
                    className="view-student"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(e); // Pass the event to position the modal
                    }}
                >
                    ✍🏽
                </button>
            </div>
        </div>
    );
}

export default Student;