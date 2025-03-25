/* eslint-disable react/prop-types */
// ErrorMessage.jsx
import { motion } from 'framer-motion';
import "../css/Message.css";

const ErrorMessage = ({ message }) => {
    return (
        <motion.div
            className="message error-message"
            initial={{ opacity: 0, y: -40 }}
            animate={{ 
                opacity: 1, 
                y: 0,
                transition: { type: 'spring', damping: 25 }
            }}
            exit={{ opacity: 0, y: -20 }}
            style={{
                // Merge transforms properly
                x: '-50%',
                top: '20px'
            }}
        >
            <span className="message-icon">❌</span>
            <p>{message}</p>
        </motion.div>
    );
};

export default ErrorMessage;