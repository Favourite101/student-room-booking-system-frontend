import { useEffect, useState } from 'react';
import { processBooking, getDailyBookings } from '../api/bookingService';
import { getStudentByName } from '../api/studentService';
import { logout } from '../api/authService';
import '../css/BookRoom.css';

function BookRoom() {
    const [bookingRequest, setBookingRequest] = useState({
        matricNo: '',
        newRoomNo: '',
        paymentCode: '',
    });
    const [students, setStudents] = useState([]);
    const [studentSearch, setStudentSearch] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [dailyBookings, setDailyBookings] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [hasFetched, setHasFetched] = useState(false); // New state variable

    useEffect(() => {
        // Fetch students by name
        const fetchStudents = async () => {
            try {
                const data = await getStudentByName(studentSearch);
                setStudents(data);
                setShowDropdown(true);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };
        fetchStudents();
    }, [studentSearch]);


    //logout
    const handleLogout = () => {
        logout();
    };
    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookingRequest({ ...bookingRequest, [name]: value });
    };

    // Handle student search
    const handleStudentSearch = async (e) => {
        setStudentSearch(e.target.value); // Clear previous search results
        setBookingRequest({ ...bookingRequest, matricNo: e.target.value.slice(-8, -1) });
    };

    // Handle date change for daily bookings
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    // Handle booking submission
    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        console.log(bookingRequest.matricNo);
        try {
            const bookingRecord = await processBooking(bookingRequest);
            console.log(`Booking successful! Payment Code: ${bookingRecord.paymentCode}`);
            setBookingRequest({ matricNo: '', newRoomNo: '', paymentCode: '' }); // Reset form
            setStudentSearch('');
        } catch (error) {
            console.log('Failed to process booking. Please try again.', error);
        }
    };

    // Fetch daily booking
    const fetchDailyBookings = async () => {
        try {
            const bookings = await getDailyBookings(new Date(selectedDate));
            setDailyBookings(bookings);
            setHasFetched(true); // Set hasFetched to true after fetching
        } catch (error) {
            console.error('Error fetching daily bookings:', error);
            console.log('Failed to fetch daily bookings.');
        }
    };

    return (
        <div className="booking-room">
            <h2>Book Room</h2>
            <br />
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
                        <datalist id="students"
                            className="student-dropdown"
                        >
                            {students.map((student) => (
                                <option
                                    key={student.id}
                                >
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
                    placeholder="Payment Code"
                    value={bookingRequest.paymentCode}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">Book Room</button>
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

            <button type="button" onClick={handleLogout}>LOGOUT</button>
        </div>
    );
}

export default BookRoom;