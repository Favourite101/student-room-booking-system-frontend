const BASE_URL = 'http://localhost:8080/api/v1/students';

export const getStudents = async () => {
    try {
        const response = await fetch(`${BASE_URL}/find-student`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

export const getStudentByName = async (name) => {
    try {
        const response = await fetch(`${BASE_URL}/find-student?search=${name}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            }
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching student by name:", error);
        return null;
    }
};

export const createStudent = async (studentData, file) => {
    try {
        const formData = new FormData();

        // Append the student data as a JSON blob with the correct Content-Type
        const studentBlob = new Blob([JSON.stringify(studentData)], { type: "application/json" });
        formData.append("student", studentBlob);

        // Append the file
        formData.append("file", file);

        const response = await fetch(`${BASE_URL}/add-student`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Failed to add student: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error adding student:", error);
        return null;
    }
};

export const updateStudent = async (studentId, studentDto) => {
    try {


        const response = await fetch(`${BASE_URL}/update-student/${studentId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            },
            body: JSON.stringify(studentDto),
        });

        if (!response.ok) {
            throw new Error(`Failed to update student: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating student:", error);
        return null;
    }
};

export const deleteStudent = async (studentId) => {
    try {
        const response = await fetch(`${BASE_URL}/delete-student/${studentId}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to delete student: ${response.statusText}`);
        }

        return { success: true };
    } catch (error) {
        console.error("Error deleting student:", error);
        return null;
    }
};