import { Routes, Route, useLocation } from "react-router-dom";
import "./css/App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/NavBar";
import ManageStudents from "./pages/ManageStudents";
import ManageRooms from "./pages/ManageRooms";
import BookRoom from "./pages/BookRoom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  return (
    <div>
      {/* Hide the navbar on the login and register pages */}
      {!isLoginPage && !isRegisterPage && <NavBar />}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/manage-students" element={<ManageStudents />} />
            <Route path="/manage-rooms" element={<ManageRooms />} />
            <Route path="/book-room" element={<BookRoom />} />
          </Route>

          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

{/** handle errors on the frontend,
  set error
       * auth: oauth,
       * fix logout,
       * upload student's picture,
       * input validation,
       * change swap logo,
       * reduce the size of navbar elements on mobile,
       * remove navbar from 404 page,
       * welcome, {username},
       * add a footer,
       * add a loading spinner,
       * add a 404 page,
       * add a logout button,
       * add a profile page,
       * add a forgot password page,
       * add a change password page,
       * add a delete account page,
       */}
