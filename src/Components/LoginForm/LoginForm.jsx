import React, { useState } from 'react';
import './LoginForm.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from "react-icons/fa";
import axios from 'axios';
import { useSessionUnauth } from './useSessionAuth.js';

async function tryLogin(email, password, remember) {
    const response = await axios.post('http://localhost:5000/login', {
        "email": email,
        "password": password,
        "remember": remember
    }).catch(function (e) {
        console.log(e);
        return false;
    });
    if (response.status === 200) {
        if (response.data && response.data.token) return response.data;
    }
    
    return false;
}

const LoginForm = () => {
    useSessionUnauth();

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if email ends with @scu.edu
        if (!email.endsWith('@scu.edu')) {
            setError('Only SCU email addresses are allowed.');
            return;
        }

        let loggedIn = await tryLogin(email, password, remember);

        if (loggedIn) {
            // Proceed with login logic here
            setError('Login succesful!');
            localStorage.setItem('currentUser', JSON.stringify({ email }));
            localStorage.setItem('session', loggedIn.token);
            navigate('/Welcome', { state: { email } });
        } else {
            setError('Invalid email or password.');
        }

    };

    const handleRemember = () => {
        setRemember(!remember);
    };

    return (
        <div className='wrapper'>
            <form onSubmit={handleSubmit}>
                <h1>Study Buddy Login</h1>

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
                    <label><input
                        type="checkbox"
                        onChange={(e) => handleRemember()}
                    />Remember me</label>
                    <a href="#">Forgot password?</a>
                </div>

                <button type="submit">Login</button>

                <div className="register-link">
                    <p>Don't have an account? <Link to="/register" className="link">Register</Link></p>
                </div>

                <div className="authenticate-link">
                    <p>Need to authenticate? <Link to="/auth" className="link">Authenticate</Link></p>
                </div>

                <div className="forgot-password-link">
                    <p>Forgot password? <Link to="/forgot" className="link">Reset</Link></p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
