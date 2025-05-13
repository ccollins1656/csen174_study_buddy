// WelcomePage.jsx
import React from 'react';
import './LoginForm.css'; // reuse same styling

const WelcomePage = () => {
    return (
        <div className="wrapper">
            <h1>Welcome to Study Buddy!</h1>
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
                You have successfully logged in with your SCU email.
            </p>
        </div>
    );
};

export default WelcomePage;
