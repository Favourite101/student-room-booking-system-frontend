import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getStudents, getStudentByName, createStudent, updateStudent, deleteStudent } from '../api/studentService';
import Student from '../components/Student';
import SuccessMessage from '../components/SuccessMessage'; // Import SuccessMessage
import ErrorMessage from '../components/ErrorMessage'; // Import ErrorMessage
import '../css/ManageStudents.css';
import { FaArrowUp, FaPlus } from 'react-icons/fa';

function ManageStudents() {
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [newStudent, setNewStudent] = useState({
        name: '',
        matricNo: '',
        email: '',
        phone: '',
        image: '',
    });
    const [file, setFile] = useState(null);
    const [success, setSuccess] = useState(null); // State for success message
    const [error, setError] = useState(null); // State for error message
    const [showScrollButton, setShowScrollButton] = useState(false);
    const topRef = useRef(null);

    // Check scroll position for scroll-to-top button
    useEffect(() => {
        const handleScroll = () => {
            if (window.pageYOffset > 300) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Fetch students on component mount
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await getStudents();
                setStudents(data);
                // eslint-disable-next-line no-unused-vars
            } catch (error) {
                console.log('Error.');
            }
        };
        fetchStudents();
    }, []);

    // Handle search
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const data = await getStudentByName(searchQuery);
            if (data) {
                setStudents(data);
            } else {
                setError('No student found!');
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setError('Search failed. Please try again.');
            console.log('Error.');
        }
    };

    // Handle input change for new student
    const handleInputChange = (e) => {
        setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
    };

    // Handle file upload
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Validate email format
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Validate phone number format (11 digits)
    const validatePhoneNumber = (phone) => {
        const regex = /^\d{11}$/;
        return regex.test(phone);
    };

    // Validate matric number format (e.g., 22/0345)
    const validateMatricNumber = (matricNo) => {
        const regex = /^\d{2}\/\d{4}$/;
        return regex.test(matricNo);
    };

    // Handle adding a new student
    const handleAddStudent = async (e) => {
        e.preventDefault();

        // Input validation
        if (!newStudent.name || !newStudent.matricNo || !newStudent.email || !newStudent.phone || !file) {
            setError('All fields are required.');
            return;
        }

        if (!validateMatricNumber(newStudent.matricNo)) {
            setError('Matric number must be in the format "22/0345".');
            return;
        }

        if (!validateEmail(newStudent.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (!validatePhoneNumber(newStudent.phone)) {
            setError('Phone number must be 11 digits.');
            return;
        }

        try {
            const data = await createStudent(newStudent, file);
            if (data) {
                setStudents([...students, data]);
                setShowAddModal(false);
                setNewStudent({ name: '', matricNo: '', phone: '', email: '', image: '' });
                setFile(null);
                setSuccess('Student added successfully!');
            } else {
                setError('Failed to add student. Please try again.');
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setError('Error adding student. Please try again.');
            console.log('Error.');
        }
    };

    // Handle edit button click
    const handleEditClick = (student) => {
        setSelectedStudent(student);
        setShowEditModal(true);
    };

    // Handle phone number change in edit modal
    const handlePhoneChange = (e) => {
        setSelectedStudent({ ...selectedStudent, [e.target.name]: e.target.value });
    };

    // Handle updating a student
    const handleUpdateStudent = async (e) => {
        e.preventDefault();

        // Input validation
        if (!validatePhoneNumber(selectedStudent.phone)) {
            setError('Phone number must be 11 digits.');
            return;
        }

        if (!validateEmail(selectedStudent.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        try {
            const updatedData = await updateStudent(selectedStudent.id, { phone: selectedStudent.phone, email: selectedStudent.email }, file);
            setStudents(students.map((r) => (r.id === selectedStudent.id ? updatedData : r)));
            setShowEditModal(false);
            setFile(null);
            setSuccess('Student updated successfully!');
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setError('Error updating student. Please try again.');
            console.log('Error.');
        }
    };

    // Handle delete button click
    const handleDeleteClick = (student) => {
        setSelectedStudent(student);
        setShowDeleteModal(true);
    };

    // Handle confirming delete
    const handleConfirmDelete = async () => {
        if (!selectedStudent) return;
        try {
            await deleteStudent(selectedStudent.id);
            setStudents(students.filter((r) => r.id !== selectedStudent.id));
            setShowEditModal(false);
            setShowDeleteModal(false);
            setSuccess('Student deleted successfully!');
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setError('Error deleting student. Please try again.');
            console.log('Error.');
        }
    };

    // Close the delete modal
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedStudent(null);
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

    // Render the edit/delete modal
    const renderEditDeleteModal = () => {
        if (!showEditModal || !selectedStudent) return null;
    
        return (
            <div className="modal-overlay">
                <motion.div 
                    className="edit-modal-content"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="modal-header">
                        <h3>Edit Student</h3>
                        <button 
                            onClick={() => setShowEditModal(false)} 
                            className="modal-close"
                        >
                            ×
                        </button>
                    </div>
                    
                    <form onSubmit={handleUpdateStudent} className="modal-form">
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={selectedStudent.name}
                                disabled
                                className="disabled-input"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Matric Number</label>
                            <input
                                type="text"
                                value={selectedStudent.matricNo}
                                disabled
                                className="disabled-input"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={selectedStudent.phone}
                                onChange={handlePhoneChange}
                                required
                                placeholder="11 digit phone number"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={selectedStudent.email}
                                onChange={handlePhoneChange}
                                required
                                placeholder="Valid email address"
                            />
                        </div>
                        
                        <div className="modal-actions">
                            <button type="submit" className="update-button">
                                Save Changes
                            </button>
                            <button 
                                type="button" 
                                onClick={() => handleDeleteClick(selectedStudent)} 
                                className="edit-delete-button"
                            >
                                Delete Student
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        );
    };

    return (
        <div className="manage-students" ref={topRef}>
            {/* Messages */}
            {success && <SuccessMessage message={success} />}
            {error && <ErrorMessage message={error} />}

            {/* Floating Add Button */}
            <button 
                className="floating-add-button"
                onClick={() => setShowAddModal(true)}
                aria-label="Add new student"
            >
                <FaPlus className="add-icon" />
                <span className="add-text">Add Student</span>
            </button>

            {/* Scroll to Top Button */}
            {showScrollButton && (
                <button 
                    className="scroll-to-top"
                    onClick={scrollToTop}
                    aria-label="Scroll to top"
                >
                    <FaArrowUp />
                </button>
            )}

            {/* Search Form */}
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search for students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button">
                    Search
                </button>
            </form>
            <br /><br />

            {/* Students Grid */}
            <div className="students-grid">
                {students.length > 0 ? (
                    students.map((student, index) => (
                        <Student
                            key={index}
                            student={student}
                            handleEditClick={(e) => handleEditClick(student, e)}
                        />
                    ))
                ) : (
                    <div className="no-students-container">
                        <p className="no-students">No students found...</p>
                        <button 
                            className="add-student-empty"
                            onClick={() => setShowAddModal(true)}
                        >
                            Add New Student
                        </button>
                    </div>
                )}
            </div>

            {/* Add Student Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Add Student</h2>
                        <br />
                        <form onSubmit={handleAddStudent}>
                            <input
                                type="text"
                                name="name"
                                className="search-input"
                                placeholder="Full Name"
                                value={newStudent.name}
                                onChange={handleInputChange}
                                required
                            />
                            <br />
                            <br />
                            <input
                                type="text"
                                name="matricNo"
                                className="search-input"
                                placeholder="Matric Number (e.g., 22/0345)"
                                value={newStudent.matricNo}
                                onChange={handleInputChange}
                                required
                            />
                            <br />
                            <br />
                            <input
                                type="text"
                                name="phone"
                                className="search-input"
                                placeholder="Phone Number (11 digits)"
                                value={newStudent.phone}
                                onChange={handleInputChange}
                                required
                            />
                            <br />
                            <br />
                            <input
                                type="text"
                                name="email"
                                className="search-input"
                                placeholder="Email Address"
                                value={newStudent.email}
                                onChange={handleInputChange}
                                required
                            />
                            <br />
                            <br />
                            <input
                                type="file"
                                name="image"
                                className="search-input"
                                onChange={handleFileChange}
                                required
                            />
                            <br />
                            <br />
                            <button type="submit">Add Student</button>
                            <br />
                            <br />
                        </form>
                        <button onClick={() => setShowAddModal(false)} className="close-button">Close</button>
                    </div>
                </div>
            )}

            {/* Edit/Delete Modal */}
            {renderEditDeleteModal()}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedStudent && (
                <div className="modal-overlay">
                    <div className="edit-delete-modal-content">
                        <h2>Are you sure?</h2>
                        <p>Do you want to delete the student: <strong>{selectedStudent.name}</strong>?</p>
                        <br />
                        <button onClick={handleConfirmDelete} className="delete">
                            Yes, Delete
                        </button>
                        <button onClick={closeDeleteModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageStudents;