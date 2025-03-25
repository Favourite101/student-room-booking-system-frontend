import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { handleLogin } from "../api/authService";
import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";
import "../css/Login.css";
import swapLogo from "../images/swap.jpeg"

// Animation variants
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

function Login() {
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

    const onLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const username = e.target.username.value;
        const password = e.target.password.value;
        const loginData = { username, password };

        try {
            const data = await handleLogin(loginData);
            if (data) {
                const { accessToken, refreshToken } = data;

                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);

                setError("");
                setSuccess("Login successful, redirecting...");

                setTimeout(() => {
                    navigate("/");
                }, 2000);
            } else {
                setError("Login failed. Please check your credentials.");
            }
        } catch (error) {
            setError("Login failed. Please try again.");
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
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
        <div className="login-page">
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
                        <h1 className="login-title">Welcome Back</h1>
                        <p className="login-subtitle">Sign in to your account</p>
                    </div>
                </motion.div>

                <motion.form 
                    className="login-form" 
                    method="post" 
                    onSubmit={onLogin}
                    variants={itemVariants}
                >
                    <motion.div variants={itemVariants}>
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                className="login-input"
                                placeholder="Enter your username"
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
                                placeholder="Enter your password"
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
                                "Login"
                            )}
                        </button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="login-links">
                        <a href="/forgot-password" className="login-link">
                            Forgot password?
                        </a>
                        <a href="/register" className="login-link">
                            Don&apos;t have an account? Sign up now!
                        </a>
                    </motion.div>
                </motion.form>
            </motion.div>
        </div>
        </>
    );
}

export default Login;