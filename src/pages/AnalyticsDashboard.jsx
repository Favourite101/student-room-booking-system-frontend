import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    getSystemOptimizationMetrics,
    getRoomAnalytics,
    getBatchRoomAnalytics
} from '../api/bookingService';
import ErrorMessage from '../components/ErrorMessage';
import '../css/AnalyticsDashboard.css';
import { 
    FaChartLine, 
    FaDollarSign, 
    FaCalendarCheck,
    FaCogs,
    FaSmile,
    FaLightbulb,
    FaDoorOpen,
    FaPercentage,
    FaClock,
    FaArrowUp,
    FaEye,
    FaSyncAlt,
    FaDownload,
    FaFilter,
    FaBrain,
    FaSpinner
} from 'react-icons/fa';

function AnalyticsDashboard() {
    const [systemMetrics, setSystemMetrics] = useState(null);
    const [roomAnalytics, setRoomAnalytics] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedRoomDetails, setSelectedRoomDetails] = useState(null);
    
    const [loading, setLoading] = useState(true);
    const [roomDetailsLoading, setRoomDetailsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [refreshing, setRefreshing] = useState(false);

    // Fetch system metrics
    const fetchSystemMetrics = async () => {
        try {
            const metrics = await getSystemOptimizationMetrics();
            setSystemMetrics(metrics);
        } catch (error) {
            console.log(`Using mock system metrics for demo + ${error}`);
            setSystemMetrics({
                overallUtilizationRate: 0.847,
                totalRevenue: 15420.50,
                totalBookings: 234,
                conflictsResolved: 18,
                customerSatisfactionScore: 4.6,
                optimizationSuggestions: [
                    "Increase room capacity during peak hours (2-4 PM)",
                    "Consider dynamic pricing for high-demand time slots",
                    "Schedule maintenance during low-utilization periods"
                ]
            });
        }
    };

    // Fetch room analytics for multiple rooms
    const fetchRoomAnalytics = async () => {
        try {
            // Sample room IDs - in real app, you'd get these from a rooms endpoint
            const roomIds = [101, 102, 103, 104, 105, 201, 202, 203];
            const analytics = await getBatchRoomAnalytics(roomIds);
            
            // Filter out rooms with errors and add mock data if needed
            const validAnalytics = analytics.filter(item => !item.error);
            
            if (validAnalytics.length === 0) {
                // Mock data for demo
                setRoomAnalytics([
                    {
                        roomId: 101,
                        roomNo: "R101",
                        utilizationRate: 0.78,
                        revenue: 2340.00,
                        totalBookings: 45,
                        averageBookingDuration: 2.5,
                        peakHours: ["10:00-12:00", "14:00-16:00"],
                        recommendations: "Consider extending operating hours"
                    },
                    {
                        roomId: 102,
                        roomNo: "R102", 
                        utilizationRate: 0.65,
                        revenue: 1890.50,
                        totalBookings: 32,
                        averageBookingDuration: 3.2,
                        peakHours: ["09:00-11:00", "15:00-17:00"],
                        recommendations: "Optimize for longer meetings"
                    },
                    {
                        roomId: 103,
                        roomNo: "R103",
                        utilizationRate: 0.92,
                        revenue: 3120.75,
                        totalBookings: 68,
                        averageBookingDuration: 1.8,
                        peakHours: ["08:00-10:00", "13:00-15:00", "16:00-18:00"],
                        recommendations: "High demand - consider room expansion"
                    },
                    {
                        roomId: 201,
                        roomNo: "R201",
                        utilizationRate: 0.55,
                        revenue: 1450.25,
                        totalBookings: 28,
                        averageBookingDuration: 2.8,
                        peakHours: ["11:00-13:00"],
                        recommendations: "Promote during off-peak hours"
                    }
                ]);
            } else {
                setRoomAnalytics(validAnalytics);
            }
        } catch (error) {
            setError('Failed to fetch room analytics: ' + error.message);
        }
    };

    // Fetch detailed analytics for a specific room
    const fetchRoomDetails = async (roomId) => {
        setRoomDetailsLoading(true);
        try {
            const details = await getRoomAnalytics(roomId);
            setSelectedRoomDetails(details);
        } catch (error) {
            console.log(`Using mock room details for demo: ${error}`);
            const mockDetails = roomAnalytics.find(room => room.roomId === roomId) || {
                roomId: roomId,
                roomNo: `R${roomId}`,
                utilizationRate: 0.72,
                revenue: 2150.00,
                totalBookings: 38,
                averageBookingDuration: 2.3,
                peakHours: ["10:00-12:00", "14:00-16:00"],
                recommendations: "Optimize scheduling during peak hours"
            };
            setSelectedRoomDetails(mockDetails);
        } finally {
            setRoomDetailsLoading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                await Promise.all([
                    fetchSystemMetrics(),
                    fetchRoomAnalytics()
                ]);
                setLastUpdated(new Date());
            } catch (error) {
                setError('Failed to load dashboard data: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // Refresh all data
    const handleRefresh = async () => {
        setRefreshing(true);
        await Promise.all([
            fetchSystemMetrics(),
            fetchRoomAnalytics()
        ]);
        setLastUpdated(new Date());
        setRefreshing(false);
    };

    // Select room for detailed view
    const handleRoomSelect = (room) => {
        setSelectedRoom(room);
        fetchRoomDetails(room.roomId);
    };

    // Calculate performance metrics
    const getPerformanceColor = (rate) => {
        if (rate >= 0.8) return '#10b981'; // Green
        if (rate >= 0.6) return '#f59e0b'; // Yellow
        return '#ef4444'; // Red
    };

    const getPerformanceLabel = (rate) => {
        if (rate >= 0.8) return 'Excellent';
        if (rate >= 0.6) return 'Good';
        return 'Needs Attention';
    };

    if (loading) {
        return (
            <div className="analytics-loading">
                <FaSpinner className="spinning" />
                <h2>Loading Analytics Dashboard...</h2>
                <p>Gathering business intelligence data...</p>
            </div>
        );
    }

    return (
        <motion.div 
            className="analytics-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header */}
            <div className="dashboard-header">
                <motion.div 
                    className="header-content"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="header-icon">
                        <FaChartLine />
                    </div>
                    <div className="header-text">
                        <h1>Analytics Dashboard</h1>
                        <p>Real-time business intelligence and performance metrics</p>
                    </div>
                    <div className="header-actions">
                        <motion.button 
                            className="refresh-btn"
                            onClick={handleRefresh}
                            disabled={refreshing}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaSyncAlt className={refreshing ? 'spinning' : ''} />
                            Refresh
                        </motion.button>
                        <button className="export-btn">
                            <FaDownload />
                            Export
                        </button>
                        <button className="filter-btn">
                            <FaFilter />
                            Filter
                        </button>
                    </div>
                </motion.div>
                
                <div className="last-updated">
                    Last updated: {lastUpdated.toLocaleString()}
                </div>
            </div>

            <AnimatePresence>
                {error && <ErrorMessage message={error} />}
            </AnimatePresence>

            {/* System Overview Metrics */}
            {systemMetrics && (
                <motion.section 
                    className="system-overview"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="section-title">
                        <FaBrain className="title-icon" />
                        System Performance Overview
                    </h2>
                    
                    <div className="metrics-grid">
                        <motion.div 
                            className="metric-card utilization"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="metric-icon">
                                <FaPercentage />
                            </div>
                            <div className="metric-content">
                                <h3>Overall Utilization</h3>
                                <div className="metric-value">
                                    {(systemMetrics.overallUtilizationRate * 100).toFixed(1)}%
                                </div>
                                <div className="metric-trend positive">
                                    <FaArrowUp />
                                    <span>+5.2% from last month</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="metric-card revenue"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="metric-icon">
                                <FaDollarSign />
                            </div>
                            <div className="metric-content">
                                <h3>Total Revenue</h3>
                                <div className="metric-value">
                                    ${systemMetrics.totalRevenue?.toLocaleString() || '0'}
                                </div>
                                <div className="metric-trend positive">
                                    <FaArrowUp />
                                    <span>+12.8% growth</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="metric-card bookings"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="metric-icon">
                                <FaCalendarCheck />
                            </div>
                            <div className="metric-content">
                                <h3>Total Bookings</h3>
                                <div className="metric-value">
                                    {systemMetrics.totalBookings?.toLocaleString() || '0'}
                                </div>
                                <div className="metric-trend positive">
                                    <FaArrowUp />
                                    <span>+8.3% this month</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="metric-card conflicts"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="metric-icon">
                                <FaCogs />
                            </div>
                            <div className="metric-content">
                                <h3>Conflicts Resolved</h3>
                                <div className="metric-value">
                                    {systemMetrics.conflictsResolved || '0'}
                                </div>
                                <div className="metric-trend neutral">
                                    <span>AI-powered resolution</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="metric-card satisfaction"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="metric-icon">
                                <FaSmile />
                            </div>
                            <div className="metric-content">
                                <h3>Satisfaction Score</h3>
                                <div className="metric-value">
                                    {systemMetrics.customerSatisfactionScore?.toFixed(1) || '0.0'}/5.0
                                </div>
                                <div className="metric-trend positive">
                                    <FaArrowUp />
                                    <span>Excellent rating</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>
            )}

            {/* AI Optimization Suggestions */}
            {systemMetrics?.optimizationSuggestions && (
                <motion.section 
                    className="optimization-suggestions"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="section-title">
                        <FaLightbulb className="title-icon" />
                        AI-Powered Optimization Suggestions
                    </h2>
                    <div className="suggestions-list">
                        {systemMetrics.optimizationSuggestions.map((suggestion, index) => (
                            <motion.div 
                                key={index}
                                className="suggestion-item"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + (index * 0.1) }}
                            >
                                <div className="suggestion-icon">
                                    <FaLightbulb />
                                </div>
                                <p>{suggestion}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
            )}

            {/* Room Analytics Grid */}
            <motion.section 
                className="room-analytics-section"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <h2 className="section-title">
                    <FaDoorOpen className="title-icon" />
                    Individual Room Performance
                </h2>
                
                <div className="room-analytics-grid">
                    {roomAnalytics.map((room, index) => (
                        <motion.div 
                            key={room.roomId}
                            className={`room-card ${selectedRoom?.roomId === room.roomId ? 'selected' : ''}`}
                            onClick={() => handleRoomSelect(room)}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + (index * 0.05) }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="room-header">
                                <h3>{room.roomNo}</h3>
                                <div 
                                    className="performance-indicator"
                                    style={{ backgroundColor: getPerformanceColor(room.utilizationRate) }}
                                >
                                    {getPerformanceLabel(room.utilizationRate)}
                                </div>
                            </div>
                            
                            <div className="room-stats">
                                <div className="stat-item">
                                    <FaPercentage className="stat-icon" />
                                    <div>
                                        <span className="stat-value">{(room.utilizationRate * 100).toFixed(1)}%</span>
                                        <span className="stat-label">Utilization</span>
                                    </div>
                                </div>
                                
                                <div className="stat-item">
                                    <FaDollarSign className="stat-icon" />
                                    <div>
                                        <span className="stat-value">${room.revenue?.toFixed(0) || '0'}</span>
                                        <span className="stat-label">Revenue</span>
                                    </div>
                                </div>
                                
                                <div className="stat-item">
                                    <FaCalendarCheck className="stat-icon" />
                                    <div>
                                        <span className="stat-value">{room.totalBookings || '0'}</span>
                                        <span className="stat-label">Bookings</span>
                                    </div>
                                </div>
                                
                                <div className="stat-item">
                                    <FaClock className="stat-icon" />
                                    <div>
                                        <span className="stat-value">{room.averageBookingDuration?.toFixed(1) || '0.0'}h</span>
                                        <span className="stat-label">Avg Duration</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="peak-hours">
                                <span className="peak-label">Peak Hours:</span>
                                <div className="peak-times">
                                    {room.peakHours?.slice(0, 2).map((hour, i) => (
                                        <span key={i} className="peak-time">{hour}</span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Selected Room Details */}
            {selectedRoom && (
                <motion.section 
                    className="room-details-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h2 className="section-title">
                        <FaEye className="title-icon" />
                        Detailed Analytics - {selectedRoom.roomNo}
                    </h2>
                    
                    {roomDetailsLoading ? (
                        <div className="details-loading">
                            <FaSpinner className="spinning" />
                            <p>Loading detailed analytics...</p>
                        </div>
                    ) : selectedRoomDetails ? (
                        <div className="room-details-grid">
                            <div className="details-card utilization-chart">
                                <h3>Utilization Breakdown</h3>
                                <div className="chart-placeholder">
                                    <div className="utilization-bar">
                                        <div 
                                            className="utilization-fill"
                                            style={{ 
                                                width: `${selectedRoomDetails.utilizationRate * 100}%`,
                                                backgroundColor: getPerformanceColor(selectedRoomDetails.utilizationRate)
                                            }}
                                        ></div>
                                    </div>
                                    <p>{(selectedRoomDetails.utilizationRate * 100).toFixed(1)}% Utilized</p>
                                </div>
                            </div>
                            
                            <div className="details-card peak-analysis">
                                <h3>Peak Hours Analysis</h3>
                                <div className="peak-hours-list">
                                    {selectedRoomDetails.peakHours?.map((hour, index) => (
                                        <div key={index} className="peak-hour-item">
                                            <FaClock />
                                            <span>{hour}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="details-card recommendations">
                                <h3>AI Recommendations</h3>
                                <div className="recommendation-content">
                                    <FaLightbulb className="rec-icon" />
                                    <p>{selectedRoomDetails.recommendations}</p>
                                </div>
                            </div>
                            
                            <div className="details-card revenue-breakdown">
                                <h3>Revenue Metrics</h3>
                                <div className="revenue-stats">
                                    <div className="revenue-stat">
                                        <span className="label">Total Revenue:</span>
                                        <span className="value">${selectedRoomDetails.revenue?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="revenue-stat">
                                        <span className="label">Revenue per Booking:</span>
                                        <span className="value">
                                            ${selectedRoomDetails.totalBookings > 0 
                                                ? (selectedRoomDetails.revenue / selectedRoomDetails.totalBookings).toFixed(2) 
                                                : '0.00'}
                                        </span>
                                    </div>
                                    <div className="revenue-stat">
                                        <span className="label">Revenue per Hour:</span>
                                        <span className="value">
                                            ${selectedRoomDetails.averageBookingDuration > 0 
                                                ? (selectedRoomDetails.revenue / (selectedRoomDetails.totalBookings * selectedRoomDetails.averageBookingDuration)).toFixed(2) 
                                                : '0.00'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </motion.section>
            )}
        </motion.div>
    );
}

export default AnalyticsDashboard;