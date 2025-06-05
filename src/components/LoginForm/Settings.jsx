import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { useSessionAuth } from './useSessionAuth.js';
import axios from 'axios';
import host from './host.json' with { type: 'json' };


async function tryChangePassword(password) {
    const response = await axios.post(host.domain + ':5000/change-password', {
        "token": localStorage.getItem("session"),
        "password": password
    }).catch(function (e) {
        console.log(e);
        return false;
    });
    return response.status === 204;
}


async function tryChangeDname(dname) {
  const response = await axios.post(host.domain + ':5000/change-dname', {
    "token": localStorage.getItem("session"),
    "dname": dname
  }).catch(function (e) {
    console.log(e);
    return false;
  });
  return response.status === 204;
}

const Settings = () => {
  useSessionAuth();
  
  const [dname, setDname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newDname, setNewDname] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.email) setEmail(parsed.email);
      if (parsed.password) setPassword(parsed.password); // WARNING: Not safe in production
      if (parsed.dname) setDname(parsed.dname);
    }
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    // Update password in localStorage (just for learning, NOT safe for real apps!)
    const updatedUser = { email: email, password: newPassword, dname: dname };
    let result = await tryChangePassword(newPassword);
    if (result) {
      setMessage('Password updated successfully.');
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setPassword(newPassword);
    } else {
      setMessage('There was an error updating your password.');
    }
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleChangeDname = async (e) => {
    e.preventDefault();
    const updatedUser = { email: email, password: password, dname: newDname };
    let result = await tryChangeDname(newDname);
    if (result) {
      setMessage('Display name updated successfully.');
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setDname(newDname);
    } else {
      setMessage('There was an error updating your password.');
    }
    setNewDname('');
  }

  return (
    <Layout>
      <h1>Settings</h1>
      <div className="settings-container">
        <div className="settings-field">
          <label>Email:</label>
          <input type="text" value={email} disabled />
        </div>
        
        <div className="settings-field">
          <label>Display Name:</label>
          <input type="text" value={dname} disabled />
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

        <form onSubmit={handleChangeDname}>
          <div className="settings-field">
            <label>New Display Name:</label>
            <input
              type="text"
              value={newDname}
              onChange={(e) => setNewDname(e.target.value)}
              maxLength="20"
            />
          </div>

          <button type="submit" className="settings-button">Update Display Name</button>
        </form>

        {message && <p className="settings-message">{message}</p>}
      </div>
    </Layout>
  );
};

export default Settings;