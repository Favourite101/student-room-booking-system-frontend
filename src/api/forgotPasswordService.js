const BASE_URL = "https://room-booking-backend-ffbncsabfwf9h8f0.canadacentral-01.azurewebsites.net/forgotPassword";

// Send OTP to the user's email for verification
export const verifyEmail = async (email) => {
    try {
        // Send a POST request to the server to verify the email and send OTP
        const response = await fetch(`${BASE_URL}/verifyEmail/${email}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        // If the response is not successful, throw an error
        if (!response.ok) {
            throw new Error(`Failed to verify email: ${response.statusText}`);
        }

        return await response.text(); // Return the success message
        // eslint-disable-next-line no-unused-vars
    } catch (error) {
        console.error("Error.");
        return null;
    }
};

// Verify the OTP provided by the user
export const verifyOtp = async (otp, email) => {
    try {
        // Send a POST request to the server to verify the OTP
        const response = await fetch(`${BASE_URL}/verifyOtp/${otp}/${email}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        // If the response is not successful, throw an error
        if (!response.ok) {
            throw new Error(`Failed to verify OTP: ${response.statusText}`);
        }

        const data = await response.text(); // Get the OTP token
        return data;
        // eslint-disable-next-line no-unused-vars
    } catch (error) {
        console.error("Error.");
        return null;
    }
};

// Change the user's password
export const changePassword = async (email, otpToken, newPassword, repeatPassword) => {
    try {
        // Prepare the request body
        const requestBody = {
            password: newPassword,
            repeatPassword: repeatPassword,
        };

        // Send a POST request to the server to change the password
        const response = await fetch(`${BASE_URL}/changePassword/${email}/${otpToken}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        // If the response is not successful, throw an error
        if (!response.ok) {
            throw new Error(`Failed to change password: ${response.statusText}`);
        }

        return await response.text(); // Return the success message
        // eslint-disable-next-line no-unused-vars
    } catch (error) {
        console.error("Error.");
        return null;
    }
};