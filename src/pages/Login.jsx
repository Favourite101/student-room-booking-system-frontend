import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate for redirection
import { handleLogin } from "../api/authService";
import SuccessMessage from "../components/SuccessMessage"; // Import SuccessMessage
import ErrorMessage from "../components/ErrorMessage";
import "../css/Login.css";

function Login() {
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

    const onLogin = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        const loginData = { username, password };

        try {
            const data = await handleLogin(loginData);
            if (data) {
                const { accessToken, refreshToken } = data;

                // Store tokens
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);

                // Set success message
                setError("");
                setSuccess("Login successful, redirecting...");

                // Redirect to home after 2 seconds
                setTimeout(() => {
                    navigate("/"); // Use navigate for redirection
                }, 2000);
            } else {
                setError("Login failed. Please check your credentials.");
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setError("Login failed. Please try again.");
            console.error("Error.");
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Login</h1>
            <form className="login-form" method="post" onSubmit={onLogin}>
                <input
                    type="text"
                    name="username"
                    id="username"
                    className="login-input"
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    name="password"
                    id="password"
                    className="login-input"
                    placeholder="Password"
                    required
                />
                <button type="submit" className="login-button">
                    Login
                </button>
                <a href="/forgot-password" className="login-link">
                    Forgot password?
                </a>
            </form>

            <a href="/register" className="login-link">
                Don&#39;t have an account? Create one here!
            </a>

            {/* Display Success Message */}
            {success && <SuccessMessage message={success} />}

            {/* Display Error Message */}
            {error && <ErrorMessage message={error} />}
        </div>
    );
}

export default Login;