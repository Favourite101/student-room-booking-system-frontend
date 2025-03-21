import { useEffect, useState } from 'react';
import { processBooking, getDailyBookings } from '../api/bookingService';
import { getStudentByName } from '../api/studentService';
import SuccessMessage from '../components/SuccessMessage'; // Import SuccessMessage
import ErrorMessage from '../components/ErrorMessage'; // Import ErrorMessage
import '../css/BookRoom.css';

function BookRoom() {
    const [bookingRequest, setBookingRequest] = useState({
        matricNo: '',
        newRoomNo: '',
        paymentCode: '',
    });
    const [students, setStudents] = useState([]);
    const [studentSearch, setStudentSearch] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [dailyBookings, setDailyBookings] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [hasFetched, setHasFetched] = useState(false);
    const [success, setSuccess] = useState(null); // State for success message
    const [error, setError] = useState(null); // State for error message

    useEffect(() => {
        // Fetch students by name
        const fetchStudents = async () => {
            try {
                const data = await getStudentByName(studentSearch);
                setStudents(data);
                setShowDropdown(true);
                // eslint-disable-next-line no-unused-vars
            } catch (error) {
                console.error('Error.');
            }
        };
        fetchStudents();
    }, [studentSearch]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookingRequest({ ...bookingRequest, [name]: value });
    };

    // Handle student search
    const handleStudentSearch = async (e) => {
        setStudentSearch(e.target.value);
        setBookingRequest({ ...bookingRequest, matricNo: e.target.value.slice(-8, -1) });
    };

    // Handle date change for daily bookings
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    // Handle booking submission
    const handleBookingSubmit = async (e) => {
        e.preventDefault();

        // Validate payment code
        if (bookingRequest.paymentCode.length < 5) {
            setError("Payment code must be at least 5 characters long.");
            return;
        }

        try {
            const bookingRecord = await processBooking(bookingRequest);
            if (bookingRecord) {
                // Set success message
                setSuccess("Booking successful!");

                // Clear form and reset states
                setBookingRequest({ matricNo: '', newRoomNo: '', paymentCode: '' });
                setStudentSearch('');
            } else {
                setError("Booking failed. Please try again.");
            }
        } catch (error) {
            if (error.message.includes("Student not found")) {
                setError("Student does not exist.");
            } else if (error.message.includes("Room not found")) {
                setError("Room does not exist.");
            } else if (error.message.includes("Payment code already exists")) {
                setError("Payment code must be unique.");
            } else {
                setError("Failed to process booking. Please try again.");
            }
            console.error("Error.");
        }
    };

    // Fetch daily bookings
    const fetchDailyBookings = async () => {
        try {
            const bookings = await getDailyBookings(new Date(selectedDate));
            setDailyBookings(bookings);
            setHasFetched(true);
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setError("Failed to fetch daily bookings.");
            console.error("Error.");
        }
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
        <div className="booking-room">
            <h2>Book Room</h2>
            <br />

            {/* Display Success Message */}
            {success && <SuccessMessage message={success} />}

            {/* Display Error Message */}
            {error && <ErrorMessage message={error} />}

            {/* Booking Form */}
            <form onSubmit={handleBookingSubmit} className="booking-form">
                <div className="student-search">
                    <input
                        list="students"
                        type="text"
                        placeholder="Search Student by Name"
                        value={studentSearch}
                        onChange={handleStudentSearch}
                        required
                    />
                    {showDropdown && (
                        <datalist id="students" className="student-dropdown">
                            {students.map((student) => (
                                <option key={student.id}>
                                    {student.name} ({student.matricNo})
                                </option>
                            ))}
                        </datalist>
                    )}
                </div>
                <input
                    type="text"
                    name="newRoomNo"
                    placeholder="New Room Number"
                    value={bookingRequest.newRoomNo}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="paymentCode"
                    placeholder="Payment Code (min 5 characters)"
                    value={bookingRequest.paymentCode}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">Book Room</button>
                <p className="note">Note: Ensure the student and room exist</p>
                <p className="note">and your payment code is unique!</p>
            </form>

            {/* Daily Bookings Section */}
            <div className="daily-bookings">
                <h2>Daily Bookings</h2>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                />
                <button onClick={fetchDailyBookings}>Fetch Bookings</button>
                <br />
                <br />

                {/* Display daily bookings */}
                {dailyBookings.length > 0 ? (
                    <ul>
                        {dailyBookings.map((booking) => (
                            <li key={booking.id}>
                                <p><strong>Student:</strong> {booking.studentName} ({booking.matricNo})</p>
                                <p><strong>Room:</strong> {booking.roomNo}</p>
                                <p><strong>Payment Code:</strong> {booking.paymentCode}</p>
                                <p><strong>Date:</strong> {new Date(booking.date).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    hasFetched && <p>No bookings found for this date.</p>
                )}
            </div>
        </div>
    );
}

export default BookRoom;