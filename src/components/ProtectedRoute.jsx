import { Navigate, Outlet } from "react-router-dom";
import { refToken } from "../api/authService";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {
    // State variable to track if the session has expired
    const [isSessionExpired, setIsSessionExpired] = useState(false);

    // Check if the access token is about to expire
    useEffect(() => {
        const checkTokenExpiration = async () => {
            const accessToken = localStorage.getItem("accessToken");
            const refreshToken = localStorage.getItem("refreshToken");

            if (!accessToken || !refreshToken) {
                setIsSessionExpired(true);
                return;
            }

            try {
                // Decode the access token to check its expiration time
                const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
                const expirationTime = tokenPayload.exp * 1000; // Convert to milliseconds
                const currentTime = Date.now();

                // If the token is about to expire (e.g., within 30 seconds), refresh it
                if (expirationTime - currentTime < 30 * 1000) {
                    await refToken();
                }
                // eslint-disable-next-line no-unused-vars
            } catch (error) {
                console.error("Error.");
                setIsSessionExpired(true);
            }
        };

        checkTokenExpiration();
    }, []);

    // If the session has expired, redirect to the login page
    if (isSessionExpired) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return <Navigate to="/login" replace />;
    }

    const accessToken = localStorage.getItem("accessToken");

    // If there's no access token, redirect to the login page
    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    // If there's an access token, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;