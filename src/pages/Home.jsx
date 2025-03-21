import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaDoorOpen, FaCalendarAlt, FaBook} from "react-icons/fa"; // Import icons
import "../css/Home.css";

function Home() {
    // State variables
    const [stats, setStats] = useState({
        totalBookingsToday: 0,
        totalStudents: 0,
        totalRooms: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch statistics
    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                // Fetch daily bookings
                const bookingsResponse = await fetch(
                    `https://room-booking-backend-ffbncsabfwf9h8f0.canadacentral-01.azurewebsites.net/api/v1/bookings/daily?date=${new Date().toISOString().split('T')[0]}`, {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("accessToken"),
                    }
                    }
                );
                if (!bookingsResponse.ok) throw new Error("Failed to fetch bookings");
                const bookingsData = await bookingsResponse.json();

                // Fetch total students
                const studentsResponse = await fetch("https://room-booking-backend-ffbncsabfwf9h8f0.canadacentral-01.azurewebsites.net/api/v1/students/find-student", {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("accessToken"),
                    }
                });
                if (!studentsResponse.ok) throw new Error("Failed to fetch students");
                const studentsData = await studentsResponse.json();

                // Fetch total rooms
                const roomsResponse = await fetch("https://room-booking-backend-ffbncsabfwf9h8f0.canadacentral-01.azurewebsites.net/api/v1/rooms/find-room", {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("accessToken"),
                    }
                });
                if (!roomsResponse.ok) throw new Error("Failed to fetch rooms");
                const roomsData = await roomsResponse.json();

                // Update stats
                setStats({
                    totalBookingsToday: bookingsData.length,
                    totalStudents: studentsData.length,
                    totalRooms: roomsData.length,
                });
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    return (
        <div className="home-page">
            {/* Welcome Section */}
            <section className="welcome-section">
                <h1>Welcome to the Room Booking Management System</h1>
                <p>Efficiently manage students, rooms, and daily bookings.</p>
                <p>Note: Only admins can delete students or rooms.</p>
            </section>

            {/* Quick Links Section */}
            <section className="quick-links-section">
                <h2>Quick Actions</h2>
                <div className="quick-links-grid">
                    <Link to="/manage-students" className="quick-link">
                        <FaUsers className="link-icon" />
                        <h3>Manage Students</h3>
                        <p>Add, edit, or view student details.</p>
                    </Link>
                    <Link to="/manage-rooms" className="quick-link">
                        <FaDoorOpen className="link-icon" />
                        <h3>Manage Rooms</h3>
                        <p>Track and manage rooms.</p>
                    </Link>
                    <Link to="/book-room" className="quick-link">
                        <FaCalendarAlt className="link-icon" />
                        <h3>Book Room</h3>
                        <p>Process a new room booking.</p>
                    </Link>
                    <Link to="/daily-bookings" className="quick-link">
                        <FaBook className="link-icon" />
                        <h3>View Daily Bookings</h3>
                        <p>Check booking history for any date.</p>
                    </Link>
                </div>
            </section>

            {/* Statistics Dashboard */}
            <section className="statistics-section">
                <h2>System Statistics</h2>
                {loading ? (
                    <div className="spinner"></div>
                ) : error ? (
                    <p className="error-message">Error: {error}</p>
                ) : (
                    <div className="stats-grid">
                        <div className="stat-card">
                            <FaCalendarAlt className="stat-icon" />
                            <h3>Bookings Today</h3>
                            <p>{stats.totalBookingsToday}</p>
                        </div>
                        <div className="stat-card">
                            <FaUsers className="stat-icon" />
                            <h3>Total Students</h3>
                            <p>{stats.totalStudents}</p>
                        </div>
                        <div className="stat-card">
                            <FaDoorOpen className="stat-icon" />
                            <h3>Total Rooms</h3>
                            <p>{stats.totalRooms}</p>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}

export default Home;