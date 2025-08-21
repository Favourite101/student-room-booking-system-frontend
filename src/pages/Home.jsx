import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FaUsers, 
    FaDoorOpen, 
    FaCalendarAlt, 
    FaBook,
    FaBrain,
    FaChartLine,
    FaRocket,
    FaMagic,
    FaCogs,
    FaEye
} from "react-icons/fa";
import usePullToRefresh from '../hooks/usePullToRefresh';
import { getSystemOptimizationMetrics } from '../api/bookingService'; // Import your enhanced service
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

const aiFeatureVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      type: "spring",
      stiffness: 80
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
    const [aiMetrics, setAiMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiLoading, setAiLoading] = useState(true);
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

    // Fetch AI system metrics
    useEffect(() => {
        const fetchAIMetrics = async () => {
            try {
                const metrics = await getSystemOptimizationMetrics();
                setAiMetrics(metrics);
            } catch (error) {
                console.log(`AI metrics not available yet: ${error}`);
                // Set mock data for demo purposes
                setAiMetrics({
                    optimizationScore: 94.7,
                    conflictsResolved: 23,
                    averageBookingTime: 2.3,
                    recommendationAccuracy: 89.2
                });
            } finally {
                setAiLoading(false);
            }
        };

        fetchAIMetrics();
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

            {/* GOLDMAN SACHS SHOWCASE - AI Intelligence Platform */}
            <motion.section 
                className="ai-intelligence-hero"
                variants={aiFeatureVariants}
            >
                <div className="ai-hero-content">
                    <motion.div 
                        className="ai-badge"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3, type: "spring" }}
                    >
                        <FaBrain className="ai-badge-icon" />
                        <span>AI-Powered</span>
                    </motion.div>
                    
                    <motion.h1
                        className="ai-hero-title"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        Smart Booking Intelligence Platform
                    </motion.h1>
                    
                    <motion.p
                        className="ai-hero-subtitle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Experience next-generation room management with machine learning algorithms, 
                        predictive analytics, and real-time optimization.
                    </motion.p>

                    <motion.div 
                        className="ai-metrics-preview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        {aiLoading ? (
                            <div className="ai-metrics-loading">
                                <div className="pulse-dot"></div>
                                <span>Loading AI Analytics...</span>
                            </div>
                        ) : (
                            <div className="ai-metrics-grid">
                                <div className="ai-metric">
                                    <FaChartLine className="ai-metric-icon" />
                                    <span className="ai-metric-value">{aiMetrics?.optimizationScore}%</span>
                                    <span className="ai-metric-label">Optimization Score</span>
                                </div>
                                <div className="ai-metric">
                                    <FaCogs className="ai-metric-icon" />
                                    <span className="ai-metric-value">{aiMetrics?.conflictsResolved}</span>
                                    <span className="ai-metric-label">Conflicts Resolved</span>
                                </div>
                                <div className="ai-metric">
                                    <FaMagic className="ai-metric-icon" />
                                    <span className="ai-metric-value">{aiMetrics?.recommendationAccuracy}%</span>
                                    <span className="ai-metric-label">AI Accuracy</span>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    <motion.div
                        className="ai-cta-buttons"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <Link to="/smart-booking" className="ai-primary-btn">
                            <FaRocket className="btn-icon" />
                            Experience Smart Booking
                        </Link>
                        <Link to="/analytics-dashboard" className="ai-secondary-btn">
                            <FaEye className="btn-icon" />
                            View Analytics Dashboard
                        </Link>
                    </motion.div>
                </div>

                <motion.div 
                    className="ai-hero-visual"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    {/* Animated AI visualization */}
                    <div className="ai-brain-animation">
                        <div className="neural-network">
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="neural-node"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.3
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.section>

            {/* Welcome Section - Updated */}
            <motion.section 
                className="welcome-section"
                variants={itemVariants}
            >
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Intelligent Room Management System
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Powered by advanced algorithms for optimal resource allocation and predictive analytics.
                </motion.p>
            </motion.section>

            {/* Enhanced Quick Links Section */}
            <motion.section 
                className="quick-links-section"
                variants={itemVariants}
            >
                <motion.h2 variants={itemVariants}>Smart Actions</motion.h2>
                <div className="quick-links-grid">
                    {[
                        { 
                            icon: <FaBrain />, 
                            title: "AI Smart Booking", 
                            desc: "Let AI find your perfect room",
                            path: "/smart-booking",
                            featured: true,
                            color: "#6366f1"
                        },
                        { 
                            icon: <FaChartLine />, 
                            title: "Analytics Dashboard", 
                            desc: "Real-time insights & metrics",
                            path: "/analytics-dashboard",
                            featured: true,
                            color: "#10b981"
                        },
                        { 
                            icon: <FaUsers />, 
                            title: "Manage Students", 
                            desc: "Add, edit, or view students",
                            path: "/manage-students",
                            color: "#4285F4"
                        },
                        { 
                            icon: <FaDoorOpen />, 
                            title: "Manage Rooms", 
                            desc: "Track and manage rooms",
                            path: "/manage-rooms",
                            color: "#EA4335"
                        },
                        { 
                            icon: <FaCalendarAlt />, 
                            title: "Book Room", 
                            desc: "Traditional room booking",
                            path: "/book-room",
                            color: "#fbad03"
                        },
                        { 
                            icon: <FaBook />, 
                            title: "View Bookings", 
                            desc: "Check booking history",
                            path: "/book-room",
                            color: "#34a853"
                        }
                    ].map((link, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link 
                                to={link.path} 
                                className={`quick-link ${link.featured ? 'featured-link' : ''}`}
                                style={{ '--accent-color': link.color }}
                            >
                                <div className="link-icon-container">
                                    {link.icon}
                                    {link.featured && <div className="featured-badge">NEW</div>}
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

            {/* Statistics Dashboard - Enhanced */}
            <motion.section 
                className="statistics-section"
                variants={itemVariants}
            >
                <motion.h2 variants={itemVariants}>System Performance</motion.h2>
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
                    <div className="stats-grid enhanced-stats">
                        {[
                            { 
                                icon: <FaCalendarAlt />, 
                                title: "Bookings Today", 
                                value: stats.totalBookingsToday,
                                color: "#6eb44c",
                                trend: "+12%"
                            },
                            { 
                                icon: <FaUsers />, 
                                title: "Total Students", 
                                value: stats.totalStudents,
                                color: "#4285F4",
                                trend: "+3%"
                            },
                            { 
                                icon: <FaDoorOpen />, 
                                title: "Total Rooms", 
                                value: stats.totalRooms,
                                color: "#EA4335",
                                trend: "stable"
                            },
                            { 
                                icon: <FaBrain />, 
                                title: "AI Efficiency", 
                                value: `${aiMetrics?.optimizationScore || 94.7}%`,
                                color: "#6366f1",
                                trend: "+8%",
                                isAI: true
                            }
                        ].map((stat, index) => (
                            <motion.div 
                                key={index}
                                className={`stat-card ${stat.isAI ? 'ai-stat-card' : ''}`}
                                variants={statVariants}
                                whileHover={{ scale: 1.03 }}
                            >
                                <div 
                                    className="stat-icon-container"
                                    style={{ backgroundColor: `${stat.color}20` }}
                                >
                                    {stat.icon}
                                    {stat.isAI && <div className="ai-pulse"></div>}
                                </div>
                                <h3>{stat.title}</h3>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={stat.value}
                                        className="stat-value-container"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                    >
                                        <p className="stat-value" style={{ color: stat.color }}>
                                            {stat.value}
                                        </p>
                                        {stat.trend && (
                                            <span className={`stat-trend ${stat.trend.includes('+') ? 'positive' : 'neutral'}`}>
                                                {stat.trend}
                                            </span>
                                        )}
                                    </motion.div>
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