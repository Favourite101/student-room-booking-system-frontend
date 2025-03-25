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
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import NetworkStatusBanner from './components/NetworkStatusBanner';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  const is404Page = ![
    "/",
    "/login",
    "/register",
    "/manage-students",
    "/manage-rooms",
    "/book-room",
  ].includes(location.pathname);

  return (
    <>
      <NetworkStatusBanner />
      <div>
        {/* Hide the navbar on the login and register pages */}
        {!isLoginPage && !isRegisterPage && !is404Page && <NavBar />}
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-otp" element={<VerifyOtpPage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/manage-students" element={<ManageStudents />} />
              <Route path="/manage-rooms" element={<ManageRooms />} />
              <Route path="/book-room" element={<BookRoom />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      </>
  );
}

export default App;

{/**
       * handle errors on the frontend, ----- DONE
       * input validation, ------ DONE
       * make pages modern (thanks deepseek) ------ DONE
       * fix logout, ------ DONE
       * upload student's picture, ---- DONE
       * change swap logo, ----- DONE
       * reduce the size of navbar elements on mobile, ------ DONE
       * add a 404 page, --- DONE
       * remove navbar from 404 page, ------- DONE
       * add a footer, ------ DONE
       * add a loading spinner, -------- DONE
       * forgotPassword? ------ DONE
       *            forgotPassword/verifyEmail/{email},
       *            forgotPassword/verifyOtp/{otp}/{email},
       *            changePassword/{email}/{otpToken}
       */}
