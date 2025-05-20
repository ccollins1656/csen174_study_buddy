import React, { useState } from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";

const CreateAccount = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if email ends with @scu.edu
        if (!email.endsWith('@scu.edu')) {
            setError('Only SCU email addresses are allowed.');
            return;
        }

        // Proceed with login logic here
        setError('');
        alert('Login successful!');
    };

    return (
        <div className='wrapper'>
            <form onSubmit={handleSubmit}>
                <h1>Study Buddy Create an Account</h1>

                <div className="input-box">
                    <input
                        type="text"
                        placeholder='First Name'
                        id="username"
                        value={username}
                        onChange={}
                    />
                </div>

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

                {error && <p className="error-message">{error}</p>}

                <div className="remember-forgot">
                    <label><input type="checkbox" />Remember me</label>
                    <a href="#">Forgot password?</a>
                </div>

                <button type="submit">Login</button>

                <div className="register-link">
                    <p>Don't have an account? <a href="#">Register</a></p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;