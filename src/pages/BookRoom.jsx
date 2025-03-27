import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { processBooking, getDailyBookings } from '../api/bookingService';
import { getStudentByName } from '../api/studentService';
import SuccessMessage from '../components/SuccessMessage'; // Import SuccessMessage
import ErrorMessage from '../components/ErrorMessage'; // Import ErrorMessage
import '../css/BookRoom.css';
import { FaCalendarAlt, FaExchangeAlt } from 'react-icons/fa';

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
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            if (studentSearch.length < 2) {
                setStudents([]);
                setShowDropdown(false);
                return;
            }
            
            try {
                setIsLoading(true);
                const data = await getStudentByName(studentSearch);
                setStudents(data || []);
                setShowDropdown(data && data.length > 0);
            } catch (error) {
                console.error('Error fetching students:', error);
                setStudents([]);
                setShowDropdown(false);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchStudents, 300);
        return () => clearTimeout(debounceTimer);
    }, [studentSearch]);

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
                setError("Payment code can be random but unique.");
            } else {
                setError("Failed to process booking. Please try again.");
            }
            console.error("Error.");
        }
    };

    // Fetch daily bookings
    const fetchDailyBookings = async () => {
        try {
            setIsLoading(true);
            const bookings = await getDailyBookings(new Date(selectedDate));
            setDailyBookings(bookings);
            setHasFetched(true);
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setError("Failed to fetch daily bookings.");
            console.error("Error.");
        } finally {
            setIsLoading(false);
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
        <motion.div 
            className="booking-room"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <h2 className="page-title">Room Booking System</h2>

            <AnimatePresence>
                {success && <SuccessMessage message={success} />}
                {error && <ErrorMessage message={error} />}
            </AnimatePresence>

            {/* Booking Form */}
            <div className="booking-container">
                <motion.div 
                    className="booking-card"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="card-header">
                        <FaExchangeAlt className="header-icon" />
                        <h3>New Room Booking</h3>
                    </div>

                    <form onSubmit={handleBookingSubmit} className="booking-form">
                        <div className="form-group">
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
                        <div className='form-group'>
                            <input
                                type="text"
                                name="newRoomNo"
                                placeholder="New Room Number"
                                value={bookingRequest.newRoomNo}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <input
                                type="text"
                                name="paymentCode"
                                placeholder="Payment Code (min 5 characters)"
                                value={bookingRequest.paymentCode}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <motion.button 
                            type="submit"
                            className="submit-button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                        >
                            Book Room
                        </motion.button>
                        <div className="form-note">
                            <p>• Ensure the student and room exist.</p>
                            <p>• Payment code can be random but unique.</p>
                        </div>
                    </form>
                </motion.div>

                <motion.div 
                    className="bookings-card"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="card-header">
                        <FaCalendarAlt className="header-icon" />
                        <h3>Daily Bookings</h3>
                    </div>

                    <div className="date-selector">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                        />
                        <motion.button 
                            onClick={fetchDailyBookings}
                            className="fetch-button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                        >
                            Fetch Bookings
                        </motion.button>
                    </div>

                    <div className="bookings-list">
                        {dailyBookings.length > 0 ? (
                            <ul>
                                {dailyBookings.map((booking) => (
                                    <motion.li 
                                        key={booking.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="booking-item">
                                            <div className="booking-header">
                                                <span className="student-name">{booking.studentName}</span>
                                                <span className="matric-no">{booking.matricNo}</span>
                                            </div>
                                            <div className="booking-details">
                                                <p><strong>Room:</strong> {booking.roomNo}</p>
                                                <p><strong>Payment Code:</strong> {booking.paymentCode}</p>
                                                <p><strong>Date:</strong> {new Date(booking.date).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>
                        ) : (
                            hasFetched && (
                                <motion.div 
                                    className="no-bookings"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <p>No bookings found for this date.</p>
                                </motion.div>
                            )
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default BookRoom;