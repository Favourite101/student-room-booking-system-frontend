    const BASE_URL = "https://room-booking-backend-ffbncsabfwf9h8f0.canadacentral-01.azurewebsites.net/api/v1/auth";

    // Login
    export const handleLogin = async (loginData) => {
    try {

        // Send a POST request to the server to log in the user
        const response = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify(loginData),
        });

        // If the response is not successful, throw an error
        if (!response.ok) {
            throw new Error(`Failed to login: ${response.statusText}`);
        }
        return await response.json();
    }
    
    // If an error occurs, log it to the console and return null
    // eslint-disable-next-line no-unused-vars
    catch (error) {
        console.error("Error logging in.");
        return null;
    }
    }

    // Register
    export const handleRegister = async (registerData) => {
    try {

        // Send a POST request to the server to register the user
        const response = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registerData),
        })
        if (!response.ok) {
            throw new Error(`Failed to register: ${response.statusText}`);
        }
        return await response.json();
    }
    
    // If an error occurs, log it to the console and return null
    // eslint-disable-next-line no-unused-vars
    catch (error) {
        console.error("Error registering.");
        return null;
    }
    }

    // Refresh Access Token
    export const refToken = async () => {
        try {
            // Get the refresh token from local storage
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                console.log("Bad request.");
            }
            
            // Send a POST request to the server to refresh the access token
            const response = await fetch(`${BASE_URL}/refresh`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refreshToken }),
            });
    
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("accessToken", data.accessToken); // Store the new access token
                return data.accessToken; // Return the new access token
            } else {
                throw new Error("Failed to refresh token");
            }
        }
        
        // If an error occurs, log it to the console and return null
        // eslint-disable-next-line no-unused-vars
        catch (error) {
            alert("Session expired. Please log in again.");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login"; // Redirect to login page
            return null;
        }
    };

    // Log out the user
    export const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // Redirect to login page
    };