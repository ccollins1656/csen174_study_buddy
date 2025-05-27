import React, { useEffect, useState } from 'react';
import './Layout.css';
import { FaUser, FaHome, FaCog, FaGraduationCap } from 'react-icons/fa';
import { MdMessage } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoIosLogOut } from "react-icons/io";

const Layout = ({ children }) => {
  const [userEmail, setUserEmail] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.email) setUserEmail(parsed.email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('session');
    navigate('/');
  };

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
              <Link to="/addcourse"><FaGraduationCap className="icon" /> Add a Course</Link>
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
            <li>
              <button onClick={() => setShowLogoutModal(true)} className="logout-button">
                <IoIosLogOut className="icon" /> Logout
              </button>
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

        <div className="content">{children}</div>
      </div>

      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={handleLogout}>Yes, Log Out</button>
              <button className="cancel-button" onClick={() => setShowLogoutModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
