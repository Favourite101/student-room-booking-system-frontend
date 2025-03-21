/* eslint-disable react/prop-types */
import "../css/Message.css";

function SuccessMessage({ message }) {
    return (
        <div className="message success-message">
            <span className="message-icon">✅</span>
            <p>{message}</p>
        </div>
    );
}

export default SuccessMessage;