// WelcomePage.jsx
import React, { useEffect, useState } from 'react';
import './LoginForm.css'; // reuse same styling
import './WelcomePage.css';
import { FaUser, FaHome, FaBook, FaCog, FaGraduationCap } from 'react-icons/fa';
import { FaMessage } from "react-icons/fa6";
import { useSessionAuth } from './useSessionAuth.js';

const WelcomePage = () => {
    useSessionAuth();

    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.email) {
            setUserEmail(currentUser.email);
        }
    }, []);

    return (
        <div className="container">
            <div className="sidebar">
                <h2>Study Buddy</h2>
                <nav>
                    <ul>
                        <li><FaHome className="icon" /> Home</li>
                        <li><FaBook className="icon" /> Add Courses</li>
                        <li><FaGraduationCap className="icon" /> View Current Courses</li>
                        <li><FaMessage className="icon" /> Message Students/Tutors </li>
                        <li><FaCog className="icon" /> Settings</li>
                    </ul>
                </nav>
            </div>

            <div className="main">
                <div className="top-bar">
                    <div className="user-tooltip">
                        <FaUser className="user-icon" />
                        <span className="tooltip-text">{userEmail}</span>
                    </div>
                </div>

                <div className="content">
                    <h1>Welcome!</h1>
                    <p>Glad to have you here. Select an option from the sidebar to get started.</p>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;
