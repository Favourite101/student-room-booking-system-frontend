import "../css/Register.css";
import { handleRegister } from "../api/authService";

function Register() {

    const onRegister = async (e) => {
        e.preventDefault();

        // Get form data
        const name = e.target.name.value;
        const email = e.target.email.value;
        const username = e.target.username.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;
        if (password !== confirmPassword) {
            console.log("Passwords do not match!");
            return;
        }
        
        // Create register data
        const registerData = {name, email, username, password};
        try {
            const data = await handleRegister(registerData);
            if (data) {
                const {accessToken, refreshToken} = data;

                //store tokens
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                window.location.href = "/";
            } else {
                console.log('Registration failed!');
            }
        } catch (error) {
            console.log('Registration failed:', error);
        }
    }
    return (
    <div className="register-container">
        <h1 className="register-title">Register</h1>
        <form className="register-form" method="post" onSubmit={onRegister}>
        <input
            type="text"
            name="name"
            id="name"
            className="register-input"
            placeholder="Full Name"
            required
        />
        <input
            type="email"
            name="email"
            id="email"
            className="register-input"
            placeholder="Email"
            required
        />
        <input
            type="text"
            name="username"
            id="username"
            className="register-input"
            placeholder="Username"
        />
        <input
            type="password"
            name="password"
            id="password"
            className="register-input"
            placeholder="Password"
            required
        />
        <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            className="register-input"
            placeholder="Confirm Password"
            required
        />
        <button type="submit" className="register-button">
            Register
        </button>
        </form>
    </div>
    );
}

export default Register;