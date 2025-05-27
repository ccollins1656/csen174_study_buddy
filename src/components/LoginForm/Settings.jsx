import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { useSessionAuth } from './useSessionAuth.js';
import axios from 'axios';


async function tryChangePassword(password) {
    const response = await axios.post('http://localhost:5000/change-password', {
        "token": localStorage.getItem("session"),
        "password": password
    }).catch(function (e) {
        console.log(e);
        return false;
    });
    return response.status === 204;
}

const Settings = () => {
  useSessionAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Existing password (from localStorage)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.email) setEmail(parsed.email);
      if (parsed.password) setPassword(parsed.password); // WARNING: Not safe in production
    }
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    // Update password in localStorage (just for learning, NOT safe for real apps!)
    const updatedUser = { email, password: newPassword };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    let result = await tryChangePassword(newPassword);
    if (result) {
      setMessage('Password updated successfully.');
    } else {
      setMessage('There was an error updating your password.');
    }
    setPassword(newPassword);
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <Layout>
      <h1>Settings</h1>
      <div className="settings-container">
        <div className="settings-field">
          <label>Email:</label>
          <input type="text" value={email} disabled />
        </div>

        <div className="settings-field">
          <label>Current Password:</label>
          <input type="password" value={password} disabled />
        </div>

        <form onSubmit={handleChangePassword}>
          <div className="settings-field">
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="settings-field">
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="settings-button">Update Password</button>
        </form>

        {message && <p className="settings-message">{message}</p>}
      </div>
    </Layout>
  );
};

export default Settings;