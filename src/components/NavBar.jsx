import { Link } from "react-router-dom"
import "../css/NavBar.css"

function NavBar() {

  return <nav className="navbar">
    <div className="navbar-brand">
      <Link to="/" className="brand-name">Book Room</Link>
    </div>
    <div className="navbar-links">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/manage-students" className="nav-link">Manage Students</Link>
      <Link to="/manage-rooms" className="nav-link">Manage Rooms</Link>
      <Link to="/book-room" className="nav-link">Book Room</Link>
    </div>
  </nav>
}

export default NavBar;