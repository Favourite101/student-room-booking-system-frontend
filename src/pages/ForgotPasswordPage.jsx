import { useState, useEffect } from "react"; // Import useEffect
import { useNavigate } from "react-router-dom";
import { verifyEmail } from "../api/forgotPasswordService";
import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      const response = await verifyEmail(email);
      if (response) {
        setSuccess("OTP sent successfully. Redirecting...");
        setTimeout(() => {
          navigate("/verify-otp", { state: { email } });
        }, 2000);
      }
      else {
        setError("The email provided is not associated with any account.");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Forgot Password</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>

      {/* Display Success Message */}
      {success && <SuccessMessage message={success} />}

      {/* Display Error Message */}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}

export default ForgotPasswordPage;
