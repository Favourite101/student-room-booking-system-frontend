const BASE_URL = 'https://room-booking-backend-ffbncsabfwf9h8f0.canadacentral-01.azurewebsites.net/api/v1/students';

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
        // eslint-disable-next-line no-unused-vars
    } catch (error) {
        console.error("Error");
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
        // eslint-disable-next-line no-unused-vars
    } catch (error) {
        console.error("Error.");
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
        // eslint-disable-next-line no-unused-vars
    } catch (error) {
        console.error("Error.");
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
        // eslint-disable-next-line no-unused-vars
    } catch (error) {
        console.error("Error.");
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
        // eslint-disable-next-line no-unused-vars
    } catch (error) {
        console.error("Error.");
        return null;
    }
};