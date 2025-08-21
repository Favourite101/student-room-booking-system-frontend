import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    processSmartBooking, 
    getRoomRecommendations, 
    analyzeBookingConflicts,
    executeEnhancedBookingWorkflow 
} from '../api/bookingService';
import { getStudentByName } from '../api/studentService';
import SuccessMessage from '../components/SuccessMessage';
import ErrorMessage from '../components/ErrorMessage';
import '../css/SmartBooking.css';
import { 
    FaBrain, 
    FaRocket, 
    FaExclamationTriangle,
    FaCheckCircle,
    FaUsers,
    FaProjectDiagram,
    FaSnowflake,
    FaChalkboardTeacher,
    FaStar,
    FaLightbulb,
    FaSpinner
} from 'react-icons/fa';

// Helper function to format datetime for backend compatibility
const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    // Ensure seconds are included for backend compatibility
    return dateTimeString.length === 16 ? dateTimeString + ':00' : dateTimeString;
};

function SmartBooking() {
    const [bookingRequest, setBookingRequest] = useState({
        matricNo: '',
        newRoomNo: '',
        paymentCode: '',
        startTime: '',
        endTime: '',
        expectedAttendees: 1,
        purpose: '',
        priority: 3,
        preferredFloor: 1,
        studentType: 'REGULAR',
        needsProjector: false,
        needsWhiteboard: false,
        needsAirConditioning: false,
        useRecommendationEngine: true
    });

    const [students, setStudents] = useState([]);
    const [studentSearch, setStudentSearch] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    
    // AI Results States
    const [recommendations, setRecommendations] = useState([]);
    const [conflictAnalysis, setConflictAnalysis] = useState(null);
    const [bookingResult, setBookingResult] = useState(null);
    const [workflowResult, setWorkflowResult] = useState(null);
    
    // UI States
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [showRecommendations, setShowRecommendations] = useState(false);
    const [selectedRecommendation, setSelectedRecommendation] = useState(null);

    // Student search effect
    useEffect(() => {
        const fetchStudents = async () => {
            if (studentSearch.length < 2) {
                setStudents([]);
                setShowDropdown(false);
                return;
            }
            
            try {
                const data = await getStudentByName(studentSearch);
                setStudents(data || []);
                setShowDropdown(data && data.length > 0);
            } catch (error) {
                console.error('Error fetching students:', error);
                setStudents([]);
                setShowDropdown(false);
            }
        };

        const debounceTimer = setTimeout(fetchStudents, 300);
        return () => clearTimeout(debounceTimer);
    }, [studentSearch]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setBookingRequest(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleStudentSearch = (e) => {
        const value = e.target.value;
        setStudentSearch(value);
        
        // Extract matric number if student selected
        const selectedStudent = students.find(s => value.includes(s.name));
        if (selectedStudent) {
            setBookingRequest(prev => ({ ...prev, matricNo: selectedStudent.matricNo }));
        }
    };

    // Step 1: Get AI Recommendations
    const handleGetRecommendations = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const formattedRequest = {
                ...bookingRequest,
                startTime: formatDateTime(bookingRequest.startTime),
                endTime: formatDateTime(bookingRequest.endTime)
            };
            const recs = await getRoomRecommendations(formattedRequest);
            setRecommendations(recs);
            setShowRecommendations(true);
            setCurrentStep(2);
            setSuccess('AI recommendations generated successfully!');
        } catch (error) {
            setError('Failed to get recommendations: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Analyze Conflicts
    const handleAnalyzeConflicts = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const formattedRequest = {
                ...bookingRequest,
                startTime: formatDateTime(bookingRequest.startTime),
                endTime: formatDateTime(bookingRequest.endTime)
            };
            const analysis = await analyzeBookingConflicts(formattedRequest);
            setConflictAnalysis(analysis);
            setCurrentStep(3);
            setSuccess('Conflict analysis completed!');
        } catch (error) {
            setError('Failed to analyze conflicts: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Step 3: Process Smart Booking
    const handleSmartBooking = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const formattedRequest = {
                ...bookingRequest,
                startTime: formatDateTime(bookingRequest.startTime),
                endTime: formatDateTime(bookingRequest.endTime)
            };
            const result = await processSmartBooking(formattedRequest);
            setBookingResult(result);
            setCurrentStep(4);
            setSuccess('Smart booking completed successfully!');
        } catch (error) {
            setError('Smart booking failed: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Enhanced Workflow - All steps at once
    const handleEnhancedWorkflow = async () => {
        setIsLoading(true);
        setError(null);
        setCurrentStep(0);
        
        try {
            const formattedRequest = {
                ...bookingRequest,
                startTime: formatDateTime(bookingRequest.startTime),
                endTime: formatDateTime(bookingRequest.endTime)
            };
            const result = await executeEnhancedBookingWorkflow(formattedRequest);
            setWorkflowResult(result);
            
            if (result.success) {
                setRecommendations(result.recommendations || []);
                setConflictAnalysis(result.conflictAnalysis);
                setBookingResult(result.bookingResult);
                setCurrentStep(4);
                setSuccess('Enhanced AI workflow completed successfully!');
            } else {
                setError('Workflow failed: ' + result.error);
            }
        } catch (error) {
            setError('Enhanced workflow failed: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const selectRecommendation = (rec) => {
        setSelectedRecommendation(rec);
        setBookingRequest(prev => ({
            ...prev,
            newRoomNo: rec.room.roomNo,
            roomId: rec.room.id
        }));
    };

    // Clear messages after timeout
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 6000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <motion.div 
            className="smart-booking-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header */}
            <div className="smart-booking-header">
                <motion.div 
                    className="header-content"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="header-icon">
                        <FaBrain />
                    </div>
                    <div className="header-text">
                        <h1>AI-Powered Smart Booking</h1>
                        <p>Experience next-generation room management with machine learning algorithms</p>
                    </div>
                </motion.div>

                {/* Progress Steps */}
                <div className="progress-steps">
                    {[
                        { step: 1, label: 'Setup', icon: FaUsers },
                        { step: 2, label: 'Recommendations', icon: FaBrain },
                        { step: 3, label: 'Conflicts', icon: FaExclamationTriangle },
                        { step: 4, label: 'Complete', icon: FaCheckCircle }
                    ].map(({ step, label, icon: Icon }) => (
                        <div 
                            key={step}
                            className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
                        >
                            <div className="step-circle">
                                <Icon />
                            </div>
                            <span>{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {success && <SuccessMessage message={success} />}
                {error && <ErrorMessage message={error} />}
            </AnimatePresence>

            <div className="smart-booking-container">
                {/* Booking Form */}
                <motion.div 
                    className="booking-form-card"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="card-header">
                        <FaRocket className="header-icon" />
                        <h3>Smart Booking Configuration</h3>
                    </div>

                    <div className="booking-form">
                        {/* Student Search */}
                        <div className="form-section">
                            <label>Student Information</label>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Search Student by Name"
                                    value={studentSearch}
                                    onChange={handleStudentSearch}
                                    required
                                />
                                {showDropdown && (
                                    <div className="student-dropdown">
                                        {students.map((student) => (
                                            <div 
                                                key={student.id}
                                                className="dropdown-item"
                                                onClick={() => {
                                                    setStudentSearch(`${student.name} (${student.matricNo})`);
                                                    setBookingRequest(prev => ({ ...prev, matricNo: student.matricNo }));
                                                    setShowDropdown(false);
                                                }}
                                            >
                                                {student.name} ({student.matricNo})
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Time and Duration */}
                        <div className="form-section">
                            <label>Booking Schedule</label>
                            <div className="time-inputs">
                                <div className="form-group">
                                    <label>Start Time</label>
                                    <input
                                        type="datetime-local"
                                        name="startTime"
                                        value={bookingRequest.startTime}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>End Time</label>
                                    <input
                                        type="datetime-local"
                                        name="endTime"
                                        value={bookingRequest.endTime}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Meeting Details */}
                        <div className="form-section">
                            <label>Meeting Requirements</label>
                            <div className="meeting-details">
                                <div className="form-group">
                                    <label>Expected Attendees</label>
                                    <input
                                        type="number"
                                        name="expectedAttendees"
                                        value={bookingRequest.expectedAttendees}
                                        onChange={handleInputChange}
                                        min="1"
                                        max="100"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Purpose</label>
                                    <input
                                        type="text"
                                        name="purpose"
                                        placeholder="e.g., Team Meeting, Study Session"
                                        value={bookingRequest.purpose}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Priority (1-5)</label>
                                    <select
                                        name="priority"
                                        value={bookingRequest.priority}
                                        onChange={handleInputChange}
                                    >
                                        <option value={1}>1 - Low</option>
                                        <option value={2}>2 - Below Normal</option>
                                        <option value={3}>3 - Normal</option>
                                        <option value={4}>4 - High</option>
                                        <option value={5}>5 - Critical</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Equipment Requirements */}
                        <div className="form-section">
                            <label>Equipment & Features</label>
                            <div className="equipment-checkboxes">
                                <label className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        name="needsProjector"
                                        checked={bookingRequest.needsProjector}
                                        onChange={handleInputChange}
                                    />
                                    <FaProjectDiagram className="checkbox-icon" />
                                    <span>Projector Required</span>
                                </label>
                                <label className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        name="needsWhiteboard"
                                        checked={bookingRequest.needsWhiteboard}
                                        onChange={handleInputChange}
                                    />
                                    <FaChalkboardTeacher className="checkbox-icon" />
                                    <span>Whiteboard Required</span>
                                </label>
                                <label className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        name="needsAirConditioning"
                                        checked={bookingRequest.needsAirConditioning}
                                        onChange={handleInputChange}
                                    />
                                    <FaSnowflake className="checkbox-icon" />
                                    <span>Air Conditioning</span>
                                </label>
                            </div>
                        </div>

                        {/* Additional Fields */}
                        <div className="form-section">
                            <label>Additional Information</label>
                            <div className="additional-fields">
                                <div className="form-group">
                                    <label>Preferred Floor</label>
                                    <select
                                        name="preferredFloor"
                                        value={bookingRequest.preferredFloor}
                                        onChange={handleInputChange}
                                    >
                                        <option value={1}>1st Floor</option>
                                        <option value={2}>2nd Floor</option>
                                        <option value={3}>3rd Floor</option>
                                        <option value={4}>4th Floor</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Student Type</label>
                                    <select
                                        name="studentType"
                                        value={bookingRequest.studentType}
                                        onChange={handleInputChange}
                                    >
                                        <option value="REGULAR">Regular Student</option>
                                        <option value="FINAL_YEAR">Final Year</option>
                                        <option value="GRADUATE">Graduate Student</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Payment Code</label>
                                    <input
                                        type="text"
                                        name="paymentCode"
                                        placeholder="Unique payment code"
                                        value={bookingRequest.paymentCode}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="action-buttons">
                            <motion.button 
                                onClick={handleGetRecommendations}
                                className="step-button recommendations-btn"
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isLoading && currentStep === 2 ? <FaSpinner className="spinning" /> : <FaBrain />}
                                Get AI Recommendations
                            </motion.button>

                            <motion.button 
                                onClick={handleAnalyzeConflicts}
                                className="step-button conflicts-btn"
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isLoading && currentStep === 3 ? <FaSpinner className="spinning" /> : <FaExclamationTriangle />}
                                Analyze Conflicts
                            </motion.button>

                            <motion.button 
                                onClick={handleSmartBooking}
                                className="step-button booking-btn"
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isLoading && currentStep === 4 ? <FaSpinner className="spinning" /> : <FaRocket />}
                                Process Smart Booking
                            </motion.button>

                            <motion.button 
                                onClick={handleEnhancedWorkflow}
                                className="enhanced-workflow-btn"
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isLoading && currentStep === 0 ? <FaSpinner className="spinning" /> : <FaLightbulb />}
                                Run Complete AI Workflow
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Results Panel */}
                <motion.div 
                    className="results-panel"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {/* AI Recommendations */}
                    {showRecommendations && recommendations.length > 0 && (
                        <motion.div 
                            className="result-card recommendations-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="card-header">
                                <FaBrain className="header-icon" />
                                <h3>AI Room Recommendations</h3>
                            </div>
                            <div className="recommendations-list">
                                {recommendations.map((rec, index) => (
                                    <motion.div 
                                        key={index}
                                        className={`recommendation-item ${selectedRecommendation?.room.id === rec.room.id ? 'selected' : ''}`}
                                        onClick={() => selectRecommendation(rec)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="rec-header">
                                            <div className="room-info">
                                                <h4>Room {rec.room.roomNo}</h4>
                                                <span className="floor">Floor {rec.room.floor}</span>
                                            </div>
                                            <div className="score">
                                                <FaStar />
                                                <span>{(rec.score * 100).toFixed(1)}%</span>
                                            </div>
                                        </div>
                                        <p className="reason">{rec.reason}</p>
                                        <div className="rec-details">
                                            <span>Capacity: {rec.room.capacity}</span>
                                            <span>Cost: ${rec.estimatedCost?.toFixed(2) || 'N/A'}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Conflict Analysis */}
                    {conflictAnalysis && (
                        <motion.div 
                            className="result-card conflicts-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="card-header">
                                <FaExclamationTriangle className="header-icon" />
                                <h3>Conflict Analysis</h3>
                            </div>
                            <div className="conflict-summary">
                                <div className="conflict-stat">
                                    <span className="label">Conflicts Detected:</span>
                                    <span className={`value ${conflictAnalysis.hasConflict ? 'danger' : 'success'}`}>
                                        {conflictAnalysis.hasConflict ? 'Yes' : 'None'}
                                    </span>
                                </div>
                                {conflictAnalysis.hasConflict && (
                                    <>
                                        <div className="conflict-stat">
                                            <span className="label">Resolution Strategy:</span>
                                            <span className="value">{conflictAnalysis.strategy}</span>
                                        </div>
                                        <div className="conflict-stat">
                                            <span className="label">Confidence:</span>
                                            <span className="value">{(conflictAnalysis.confidence * 100).toFixed(1)}%</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Booking Result */}
                    {bookingResult && (
                        <motion.div 
                            className="result-card booking-result-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="card-header">
                                <FaCheckCircle className="header-icon" />
                                <h3>Booking Result</h3>
                            </div>
                            <div className="booking-summary">
                                <div className={`status-badge ${bookingResult.success ? 'success' : 'error'}`}>
                                    {bookingResult.success ? 'Booking Successful' : 'Booking Failed'}
                                </div>
                                <p>{bookingResult.message}</p>
                                {bookingResult.booking && (
                                    <div className="booking-details">
                                        <p><strong>Room:</strong> {bookingResult.booking.roomNo}</p>
                                        <p><strong>Time:</strong> {new Date(bookingResult.booking.startTime).toLocaleString()}</p>
                                        <p><strong>Duration:</strong> {bookingResult.booking.duration} hours</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Enhanced Workflow Result */}
                    {workflowResult && (
                        <motion.div 
                            className="result-card workflow-result-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="card-header">
                                <FaLightbulb className="header-icon" />
                                <h3>Enhanced Workflow Summary</h3>
                            </div>
                            <div className="workflow-summary">
                                <div className={`workflow-status ${workflowResult.success ? 'success' : 'error'}`}>
                                    {workflowResult.success ? 'Workflow Completed Successfully' : 'Workflow Failed'}
                                </div>
                                {workflowResult.workflow && (
                                    <div className="workflow-steps">
                                        <div className="step-item completed">
                                            <FaCheckCircle />
                                            <span>{workflowResult.workflow.step1}</span>
                                        </div>
                                        <div className="step-item completed">
                                            <FaCheckCircle />
                                            <span>{workflowResult.workflow.step2}</span>
                                        </div>
                                        <div className="step-item completed">
                                            <FaCheckCircle />
                                            <span>{workflowResult.workflow.step3}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}

export default SmartBooking;