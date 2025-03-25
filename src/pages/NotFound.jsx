import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome, FaUsers } from "react-icons/fa";
import "../css/NotFound.css";

function NotFound() {

    return (
        <motion.div 
            className="not-found-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="not-found-content">
                <motion.h1
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    404 - Page Not Found
                </motion.h1>
                
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    Oops! The page you&apos;re looking for doesn&apos;t exist.
                </motion.p>

                <motion.div 
                    className="animation"
                    animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="120"
                        height="120"
                        fill="none"
                        stroke="#6eb44c"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12" y2="16" />
                    </svg>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    Here are some helpful links instead:
                </motion.p>

                <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    <li>
                        <Link to="/" className="nfnav-link">
                            <FaHome className="link-icon" />
                            <span>Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/manage-students" className="nfnav-link">
                            <FaUsers className="link-icon" />
                            <span>Manage Students</span>
                        </Link>
                    </li>
                </motion.ul>
            </div>
        </motion.div>
    );
}

export default NotFound;