import { useEffect, useState } from "react";
import "../css/Footer.css";

function Footer() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        return () => setIsVisible(false);
    }, []);

    return (
        <footer className={`footer ${isVisible ? 'visible' : ''}`}>
            <p>© 2025 Room Booking Management System. All rights reserved.</p>
            <p className="name">Built with ❤️ by Favourrr</p>
        </footer>
    );
}

export default Footer;