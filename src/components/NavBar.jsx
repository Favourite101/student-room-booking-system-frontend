import { Link } from "react-router-dom";
import { FaHome, FaUsers, FaDoorOpen, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa"; // Import icons
import "../css/NavBar.css";
import { logout } from '../api/authService';

function NavBar() {
    const handleLogout = () => {
        logout();
    };

  return (
      <nav className="navbar">
          <div className="navbar-brand">
              <Link to="/" className="brand-name">
                  <img src="/swap.jpeg" alt="Logo" className="brand-logo" /> {/* Custom logo */}
                  <span>Book Room</span>
              </Link>
          </div>
          <div className="navbar-links">
              <Link to="/" className="nav-link" title="Home">
                  <FaHome className="nav-icon" />
                  <span className="nav-text">Home</span>
              </Link>
              <Link to="/manage-students" className="nav-link" title="Manage Students">
                  <FaUsers className="nav-icon" />
                  <span className="nav-text">Students</span>
              </Link>
              <Link to="/manage-rooms" className="nav-link" title="Manage Rooms">
                  <FaDoorOpen className="nav-icon" />
                  <span className="nav-text">Rooms</span>
              </Link>
              <Link to="/book-room" className="nav-link" title="Book Room">
                  <FaCalendarAlt className="nav-icon" />
                  <span className="nav-text">Book Room</span>
              </Link>
              <button className="nav-link logout-button" onClick={handleLogout} title="Logout">
                  <FaSignOutAlt className="nav-icon" />
                  <span className="nav-text">Logout</span>
              </button>
          </div>
      </nav>
  );
}

export default NavBar;