import { useState, useEffect } from 'react';
import { getStudents, getStudentByName, createStudent, updateStudent, deleteStudent } from '../api/studentService';
import Student from '../components/Student';
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

    // Fetch students on component mount
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await getStudents();
                setStudents(data);
                console.log('Students:', data);
            } catch (error) {
                console.log('Error fetching students:', error);
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
                console.log('No student found!');
            }
        } catch (error) {
            console.log('Search failed:', error);
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

    // Handle adding a new student
    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            const data = await createStudent(newStudent, file);
            if (data) {
                setStudents([...students, data]);
                setShowAddModal(false);
                setNewStudent({ name: '', matricNo: '', phone: '', email: '', image: '' });
                setFile(null);
            } else {
                console.log('Failed to add student.');
            }
        } catch (error) {
            console.log('Error adding student:', error);
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
        try {
            const updatedData = await updateStudent(selectedStudent.id, { phone: selectedStudent.phone, email: selectedStudent.email }, file);
            setStudents(students.map((r) => (r.id === selectedStudent.id ? updatedData : r)));
            setShowEditModal(false);
            setFile(null);
        } catch (error) {
            console.log('Error updating student:', error);
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
        } catch (error) {
            console.log('Error deleting student:', error);
        }
    };

    // Close the delete modal
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedStudent(null);
    };

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
                                placeholder="Matric Number"
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
                                placeholder="Phone Number"
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