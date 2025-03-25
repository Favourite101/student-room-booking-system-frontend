import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUsers, FaDoorOpen, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";
import "../css/NavBar.css";
import { logout } from '../api/authService';
import swapLogo from "../images/swap.jpeg"

function NavBar() {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const [activeLink, setActiveLink] = useState(location.pathname);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-brand">
                <Link to="/" className="brand-name">
                    <img src={swapLogo} alt="Logo" className="brand-logo" />
                    <span>Book Rooms</span>
                </Link>
            </div>
            <div className="navbar-links">
                <Link 
                    to="/" 
                    className={`nav-link ${activeLink === '/' ? 'active' : ''}`}
                    onClick={() => setActiveLink('/')}
                >
                    <FaHome className="nav-icon" />
                    <span className="nav-text">Home</span>
                </Link>
                <Link 
                    to="/manage-students" 
                    className={`nav-link ${activeLink === '/manage-students' ? 'active' : ''}`}
                    onClick={() => setActiveLink('/manage-students')}
                >
                    <FaUsers className="nav-icon" />
                    <span className="nav-text">Students</span>
                </Link>
                <Link 
                    to="/manage-rooms" 
                    className={`nav-link ${activeLink === '/manage-rooms' ? 'active' : ''}`}
                    onClick={() => setActiveLink('/manage-rooms')}
                >
                    <FaDoorOpen className="nav-icon" />
                    <span className="nav-text">Rooms</span>
                </Link>
                <Link 
                    to="/book-room" 
                    className={`nav-link ${activeLink === '/book-room' ? 'active' : ''}`}
                    onClick={() => setActiveLink('/book-room')}
                >
                    <FaCalendarAlt className="nav-icon" />
                    <span className="nav-text">Book</span>
                </Link>
                <button 
                    className="nav-link logout-button" 
                    onClick={handleLogout}
                    aria-label="Logout"
                >
                    <FaSignOutAlt className="nav-icon" />
                    <span className="nav-text">Logout</span>
                </button>
            </div>
        </nav>
    );
}

export default NavBar;