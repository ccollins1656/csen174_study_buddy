import React, { useState } from 'react';
import './LoginForm.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from "react-icons/fa";
import axios from 'axios';
import { useSessionUnauth } from './useSessionAuth.js';
import host from './host.json' with { type: 'json' };

async function tryRegister(displayName, email, password) {
    const response = await axios.post(host.domain + ':5000/create-account', {
        "display_name": displayName,
        "email": email,
        "password": password
    }).catch(function (e) {
        console.log(e);
        return false;
    });
    if (response && response.status === 204) {
        return true;
    } else {
        return false;
    }
}

const RegisterForm = () => {
    useSessionUnauth();
    
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [dname, setDname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset messages
        setError('');
        setSuccess('');

        // Email validation
        if (!email.endsWith('@scu.edu')) {
            setError('Only SCU email addresses are allowed.');
            return;
        }

        // Display name validation
        if (dname.length < 1) {
            setError('Display name cannot be empty.');
            return;
        }
        
        // Password match check
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        let registered = await tryRegister(dname, email, password);

        if (registered) {
            // Proceed with registration logic
            setSuccess('Registration successful!');
            setError('');
            // Optionally clear inputs
            setEmail('');
            setDname('');
            setPassword('');
            setConfirmPassword('');
            // Navigate to auth page
            navigate('/auth');
        } else {
            setError('Could not complete registration. If you have already created an account, sign in instead.');
        }
        
    };

    return (
        <div className='wrapper'>
            <form onSubmit={handleSubmit}>
                <h1>Study Buddy Registration</h1>

                <div className="input-box">
                    <input
                        type="text"
                        placeholder='SCU Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <FaUser className='icon' />
                </div>

                <div className="input-box">
                    <input
                        type="text"
                        placeholder='Display Name'
                        value={dname}
                        onChange={(e) => setDname(e.target.value)}
                        maxLength="20"
                        required
                    />
                    <FaUser className='icon' />
                </div>

                <div className="input-box">
                    <input
                        type="password"
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <FaLock className='icon' />
                </div>

                <div className="input-box">
                    <input
                        type="password"
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <FaLock className='icon' />
                </div>

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                <button type="submit">Register</button>

                <div className="register-link">
                    <p>Already have an account? <Link to="/" className="link">Login</Link></p>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;

