import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaUsers, FaDoorOpen, FaCalendarAlt, FaBook } from "react-icons/fa";
import usePullToRefresh from '../hooks/usePullToRefresh';
import "../css/Home.css";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const statVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      type: "spring",
      stiffness: 100
    }
  }
};

function Home() {
    usePullToRefresh();
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
        <motion.div 
            className="home-page"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Decorative background elements */}
            <div className="background-elements">
                <div className="circle circle-1"></div>
                <div className="circle circle-2"></div>
                <div className="circle circle-3"></div>
            </div>

            {/* Welcome Section */}
            <motion.section 
                className="welcome-section"
                variants={itemVariants}
            >
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Welcome to the Room Booking System
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Efficiently manage students, rooms, and daily bookings.
                </motion.p>
            </motion.section>

            {/* Quick Links Section */}
            <motion.section 
                className="quick-links-section"
                variants={itemVariants}
            >
                <motion.h2 variants={itemVariants}>Quick Actions</motion.h2>
                <div className="quick-links-grid">
                    {[
                        { 
                            icon: <FaUsers />, 
                            title: "Manage Students", 
                            desc: "Add, edit, or view students",
                            path: "/manage-students"
                        },
                        { 
                            icon: <FaDoorOpen />, 
                            title: "Manage Rooms", 
                            desc: "Track and manage rooms",
                            path: "/manage-rooms"
                        },
                        { 
                            icon: <FaCalendarAlt />, 
                            title: "Book Room", 
                            desc: "Process a new room booking",
                            path: "/book-room"
                        },
                        { 
                            icon: <FaBook />, 
                            title: "View Bookings", 
                            desc: "Check booking history",
                            path: "/book-room"
                        }
                    ].map((link, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link to={link.path} className="quick-link">
                                <div className="link-icon-container">
                                    {link.icon}
                                </div>
                                <div className="link-content">
                                    <h3>{link.title}</h3>
                                    <p>{link.desc}</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Statistics Dashboard */}
            <motion.section 
                className="statistics-section"
                variants={itemVariants}
            >
                <motion.h2 variants={itemVariants}>System Statistics</motion.h2>
                {loading ? (
                    <div className="spinner-container">
                        <div className="spinner"></div>
                    </div>
                ) : error ? (
                    <motion.p 
                        className="error-message"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {error}
                    </motion.p>
                ) : (
                    <div className="stats-grid">
                        {[
                            { 
                                icon: <FaCalendarAlt />, 
                                title: "Bookings Today", 
                                value: stats.totalBookingsToday,
                                color: "#6eb44c"
                            },
                            { 
                                icon: <FaUsers />, 
                                title: "Total Students", 
                                value: stats.totalStudents,
                                color: "#4285F4"
                            },
                            { 
                                icon: <FaDoorOpen />, 
                                title: "Total Rooms", 
                                value: stats.totalRooms,
                                color: "#EA4335"
                            } 
                        ].map((stat, index) => (
                            <motion.div 
                                key={index}
                                className="stat-card"
                                variants={statVariants}
                                whileHover={{ scale: 1.03 }}
                            >
                                <div 
                                    className="stat-icon-container"
                                    style={{ backgroundColor: `${stat.color}20` }}
                                >
                                    {stat.icon}
                                </div>
                                <h3>{stat.title}</h3>
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={stat.value}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        style={{ color: stat.color }}
                                    >
                                        {stat.value}
                                    </motion.p>
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.section>
        </motion.div>
    );
}

export default Home;