/* eslint-disable react/prop-types */
import "../css/Message.css";

function ErrorMessage({ message }) {
    return (
        <div className="message error-message">
            <span className="message-icon">❌</span>
            <p>{message}</p>
        </div>
    );
}

export default ErrorMessage;