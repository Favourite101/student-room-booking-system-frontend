import { useState, useEffect } from "react"; // Import useEffect
import { useLocation, useNavigate } from "react-router-dom";
import { changePassword } from "../api/ForgotPasswordService";
import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";
import "../css/AuthStyles.css";

function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { email, otpToken } = location.state;

  // Automatically clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000); // 5 seconds
      return () => clearTimeout(timer); // Clear the timer if the component unmounts
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate password length
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    if (newPassword !== repeatPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await changePassword(email, otpToken, newPassword, repeatPassword);
      if (response) {
        setSuccess("Password changed successfully. Redirecting...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError("Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Change Password</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div>
          <input
            type="password"
            placeholder="New Password"
            className="auth-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Repeat Password"
            className="auth-input"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Changing Password..." : "Change Password"}
        </button>
      </form>

      {/* Display Success Message */}
      {success && <SuccessMessage message={success} />}

      {/* Display Error Message */}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}

export default ChangePasswordPage;