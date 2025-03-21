import { Link } from "react-router-dom";
import "../css/NotFound.css";

function NotFound() {
    return (
        <div className="not-found-container">
            <h1>404 - Page Not Found</h1>
            <p>Oops! The page you&apos;re looking for doesn&apos;t exist.</p>
            <div className="animation">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="100"
                    height="100"
                    fill="none"
                    stroke="#086647"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12" y2="16" />
                </svg>
            </div>
            <p>Here are some helpful links instead:</p>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/manage-students">Manage Students</Link>
                </li>
                <li>
                    <Link to="/swap-battery">Swap Battery</Link>
                </li>
            </ul>
        </div>
    );
}

export default NotFound;