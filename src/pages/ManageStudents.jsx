import { useState, useEffect } from 'react';
import { getStudents, getStudentByName, createStudent, updateStudent, deleteStudent } from '../api/studentService';
import Student from '../components/Student';
import SuccessMessage from '../components/SuccessMessage'; // Import SuccessMessage
import ErrorMessage from '../components/ErrorMessage'; // Import ErrorMessage
import '../css/ManageStudents.css';
import { Link } from 'react-router-dom';

function ManageStudents() {
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
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
    const handleEditClick = (student, event) => {
        const buttonRect = event.target.getBoundingClientRect();
        setModalPosition({
            top: buttonRect.bottom + window.scrollY + 8,
            left: buttonRect.left + window.scrollX,
        });
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
            <div
                className="edit-delete-modal"
                style={{
                    position: 'absolute',
                    top: modalPosition.top,
                    left: modalPosition.left,
                }}
            >
                <button onClick={() => setShowEditModal(false)} className="close">
                    ×
                </button>
                <form onSubmit={handleUpdateStudent}>
                    <label>Phone Number</label>
                    <input
                        type="text"
                        name="phone"
                        value={selectedStudent.phone}
                        onChange={handlePhoneChange}
                        required
                    />
                    <label>Email</label>
                    <input
                        type="text"
                        name="email"
                        value={selectedStudent.email}
                        onChange={handlePhoneChange}
                        required
                    />
                    <button type="submit">Update</button>
                </form>
                <button onClick={() => handleDeleteClick(selectedStudent)} className="delete">
                    Delete Student
                </button>
            </div>
        );
    };

    return (
        <div className="manage-students">
            {/* Display Success Message */}
            {success && <SuccessMessage message={success} />}

            {/* Display Error Message */}
            {error && <ErrorMessage message={error} />}

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
                    <p className="no-students">No students found...</p>
                )}

                {/* Add Student Button */}
                <Link onClick={() => setShowAddModal(true)} className="add-student">
                    +
                </Link>
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