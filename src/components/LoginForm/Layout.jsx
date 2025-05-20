import React, { useEffect, useState } from 'react';
import './Layout.css';
import { FaUser, FaHome, FaBook, FaCog,  FaGraduationCap } from 'react-icons/fa';
import { MdMessage } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import { Link, useLocation } from 'react-router-dom';
import { IoIosLogOut } from "react-icons/io";
import axios from 'axios';

const Layout = ({ children }) => {
    const [userEmail, setUserEmail] = useState('');
    const location = useLocation();

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            if (parsed.email) setUserEmail(parsed.email);
        }
    }, []);

    function handleLogout() {
        const response = axios.post('http://localhost:5000/logout', {
            "token": localStorage.getItem('session')
        }).catch(function (e) {
            console.log(e);
        });
        localStorage.removeItem('session');
    }

    return (
        <div className="container">
            <div className="sidebar">
                <h2>Study Buddy</h2>
                <nav>
                    <ul>
                        <li className={location.pathname === '/welcome' ? 'active' : ''}>
                            <Link to="/welcome"><FaHome className="icon" /> Home</Link>
                        </li>
                        <li className={location.pathname === '/addcourse' ? 'active' : ''}>
                            <Link to="/addcourse"><FaGraduationCap className="icon"/> Add a Course</Link>
                        </li>
                        <li className={location.pathname === '/groupforum' ? 'active' : ''}>
                            <Link to="/groupforum"><FaUserGroup className="icon" /> Group Forum</Link>
                        </li>
                        <li className={location.pathname === '/messagepage' ? 'active' : ''}>
                            <Link to="/messagepage"><MdMessage className="icon" /> Message Tutor/Student</Link>
                        </li>
                         <li className={location.pathname === '/settings' ? 'active' : ''}>
                            <Link to="/settings"><FaCog className="icon" /> Settings</Link>
                        </li>
                         <li className={location.pathname === '/' ? 'active' : ''}>
                            <Link to="/" onClick={handleLogout}><IoIosLogOut className="icon" /> Logout</Link>
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="main">
                <div className="top-bar">
                    <div className="user-tooltip">
                        <FaUser className="user-icon" />
                        {userEmail && <span className="tooltip-text">{userEmail}</span>}
                    </div>
                </div>

                <div className="content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
