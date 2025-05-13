import React, { useState } from 'react';
import './LoginForm.css';
import { Link } from 'react-router-dom';
import { FaUser, FaLock } from "react-icons/fa";

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Reset messages
        setError('');
        setSuccess('');

        // Email validation
        if (!email.endsWith('@scu.edu')) {
            setError('Only SCU email addresses are allowed.');
            return;
        }

        // Password match check
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Proceed with registration logic
        setSuccess('Registration successful!');
        // Optionally clear inputs
        setEmail('');
        setPassword('');
        setConfirmPassword('');
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
