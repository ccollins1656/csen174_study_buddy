// WelcomePage.jsx
import React from 'react';
import './LoginForm.css'; // reuse same styling
import { useLocation } from 'react-router-dom';

const WelcomePage = () => {
    const location = useLocation();
    const email = location.state?.email;

    return (
        <div className="wrapper">
            <h1>Welcome to Study Buddy!</h1>
            {email && <p style={{ textAlign: 'center', marginTop: '20px' }}>
                Logged in as: <strong>{email}</strong>
            </p>}
        </div>
    );
};

export default WelcomePage;
