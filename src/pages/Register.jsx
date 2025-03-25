import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate for redirection
import { handleRegister } from "../api/authService";
import SuccessMessage from "../components/SuccessMessage"; // Import SuccessMessage
import ErrorMessage from "../components/ErrorMessage"; // Import ErrorMessage
import "../css/Register.css";

function Register() {
    const [success, setSuccess] = useState(null); // State for success message
    const [error, setError] = useState(null); // State for error message
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        if (error) {
          const timer = setTimeout(() => {
            setError("");
          }, 5000); // 5 seconds
          return () => clearTimeout(timer); // Clear the timer if the component unmounts
        }
      }, [error]);

    const onRegister = async (e) => {
        e.preventDefault();

        // Get form data
        const name = e.target.name.value;
        const email = e.target.email.value;
        const username = e.target.username.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;

        // Input validation
        if (!name || !email || !username || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        // Create register data
        const registerData = { name, email, username, password };

        try {
            const data = await handleRegister(registerData);
            if (data) {
                const { accessToken, refreshToken } = data;

                // Store tokens
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);

                // Set success message
                setError("");
                setSuccess("Registration successful, redirecting...");

                // Redirect to home after 2 seconds
                setTimeout(() => {
                    navigate("/"); // Use navigate for redirection
                }, 2000);
            } else {
                setError("Registration failed. This email/ username is linked with another account.");
            }
        } catch (error) {
            // Handle different types of errors
            if (error.message === "Failed to fetch") {
                setError("Unable to connect to the server. Please try again later.");
            } else {
                setError("Registration failed. Please check your details and try again.");
            }
            console.error("Error.");
        }
    };

    // Function to validate email format
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    return (
        <div className="register-container">
            <h1 className="register-title">Register</h1>
            <form className="register-form" method="post" onSubmit={onRegister}>
                <input
                    type="text"
                    name="name"
                    id="name"
                    className="register-input"
                    placeholder="Full Name"
                    required
                />
                <input
                    type="email"
                    name="email"
                    id="email"
                    className="register-input"
                    placeholder="Email"
                    required
                />
                <input
                    type="text"
                    name="username"
                    id="username"
                    className="register-input"
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    name="password"
                    id="password"
                    className="register-input"
                    placeholder="Password"
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className="register-input"
                    placeholder="Confirm Password"
                    required
                />
                <button type="submit" className="register-button">
                    Register
                </button>
            </form>
            <a href="/login" className="login-link">
                Already have an account? Login here!
            </a>

            {/* Display Success Message */}
            {success && <SuccessMessage message={success} />}

            {/* Display Error Message */}
            {error && <ErrorMessage message={error} />}
        </div>
    );
}

export default Register;