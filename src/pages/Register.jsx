import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { handleRegister } from "../api/authService";
import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";
import "../css/Login.css"; // Reusing the same CSS file
import swapLogo from "../images/swap.jpeg";

// Animation variants (same as login)
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4
    }
  }
};

function Register() {
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (error) {
          const timer = setTimeout(() => {
            setError("");
          }, 5000);
          return () => clearTimeout(timer);
        }
    }, [error]);

    const onRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const name = e.target.name.value;
        const email = e.target.email.value;
        const username = e.target.username.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;

        if (!name || !email || !username || !password || !confirmPassword) {
            setError("All fields are required.");
            setIsLoading(false);
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            setIsLoading(false);
            return;
        }

        const registerData = { name, email, username, password };

        try {
            const data = await handleRegister(registerData);
            if (data) {
                const { accessToken, refreshToken } = data;

                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);

                setError("");
                setSuccess("Registration successful, redirecting...");

                setTimeout(() => {
                    navigate("/");
                }, 2000);
            } else {
                setError("Registration failed. This email/username is linked with another account.");
            }
        } catch (error) {
            if (error.message === "Failed to fetch") {
                setError("Unable to connect to the server. Please try again later.");
            } else {
                setError("Registration failed. Please check your details and try again.");
            }
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    return (
        <>
        {/* Message animations */}
        <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <SuccessMessage message={success} />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <ErrorMessage message={error} />
                    </motion.div>
                )}
            </AnimatePresence>
        <div className="login-page"> {/* Using the same class as login */}
            {/* Decorative background elements */}
            <div className="login-decoration">
                <div className="circle circle-1"></div>
                <div className="circle circle-2"></div>
                <div className="circle circle-3"></div>
            </div>

            {/* Main content with animations */}
            <motion.div 
                className="login-container"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div variants={itemVariants}>
                    <div className="login-header">
                        <img 
                            src={swapLogo} 
                            alt="App Logo" 
                            className="login-logo"
                        />
                        <h1 className="login-title">Create Account</h1>
                        <p className="login-subtitle">Join us today</p>
                    </div>
                </motion.div>

                <motion.form 
                    className="login-form" 
                    method="post" 
                    onSubmit={onRegister}
                    variants={itemVariants}
                >
                    <motion.div variants={itemVariants}>
                        <div className="input-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="login-input"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="login-input"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                className="login-input"
                                placeholder="Choose a username"
                                required
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="login-input"
                                placeholder="Create a password"
                                required
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <div className="input-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                className="login-input"
                                placeholder="Confirm your password"
                                required
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <button 
                            type="submit" 
                            className="login-button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isLoading ? (
                                <span className="loading-spinner"></span>
                            ) : (
                                "Register"
                            )}
                        </button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="login-links">
                        <a href="/login" className="login-link">
                            Already have an account? Login here!
                        </a>
                    </motion.div>
                </motion.form>
            </motion.div>
        </div>
        </>
    );
}

export default Register;