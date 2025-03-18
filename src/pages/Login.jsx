import "../css/Login.css";
import { handleLogin } from "../api/authService";

function Login() {
    const onLogin = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        const loginData = { username, password };
        try {
            const data = await handleLogin(loginData);
            if (data) {
                const {accessToken, refreshToken} = data;

                //store tokens
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                // Redirect to home
                window.location.href = "/";
            } else {
                console.log('Login failed!');
            }
        } catch (error) {
            console.log('Login failed:', error);
        }
    }

    const handleGoogleLogin = () => {
    // Replace with your Google OAuth logic
    window.location.href = "https://accounts.google.com/o/oauth2/auth"; // Example OAuth URL
    };

    return (
    <div className="login-container">
        <h1 className="login-title">Login</h1>
        <form className="login-form" method="post" onSubmit={onLogin}>
        <input
            type="text"
            name="username"
            id="username"
            className="login-input"
            placeholder="Username"
            required
        />
        <input
            type="password"
            name="password"
            id="password"
            className="login-input"
            placeholder="Password"
            required
        />
        <button type="submit" className="login-button">
            Login
        </button>
        <a href="http://" className="login-link">Forgot password?</a>
        </form>
        <div className="login-divider">
        <span>OR</span>
        </div>
        <button className="google-login-button" onClick={handleGoogleLogin}>
        <img
            src="../../public/google.png"
            alt="Google Logo"
            className="google-logo"
        />
        Login with Google
        </button>
        <a href="/register" className="login-link">Don&#39;t have an account? Create one here!</a>
    </div>
    );
    }

    export default Login;