import { useState, useEffect } from "react"; // Import useEffect
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../api/ForgotPasswordService";
import SuccessMessage from "../components/SuccessMessage"; // Import SuccessMessage
import ErrorMessage from "../components/ErrorMessage"; // Import ErrorMessage

function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email; // Retrieve email from navigation state

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

    try {
      const otpToken = await verifyOtp(otp, email);
      if (otpToken) {
        setSuccess("OTP verified successfully. Redirecting...");
        setTimeout(() => {
          navigate("/change-password", { state: { email, otpToken } }); // Pass email and OTP token to the next page
        }, 2000);
      }
      else {
        setError("Invalid OTP. Please try again.");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Verify OTP</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            className="auth-input"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Verifying OTP..." : "Verify OTP"}
        </button>
      </form>

      {/* Display Success Message */}
      {success && <SuccessMessage message={success} />}

      {/* Display Error Message */}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}

export default VerifyOtpPage;