import React, { useState } from 'react';
import './LoginForm.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from "react-icons/fa";
import axios from 'axios';

async function tryLogin(email, password) {
    const response = await axios.post('http://localhost:5000/login', {
        "email": email,
        "password": password
    }).catch(function (e) {
        console.log(e);
        return false;
    });
    if (response.status === 204) {
        return true;
    } else {
        return false;
    }
}

const LoginForm = () => {
    const navigate = useNavigate();
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

        let loggedIn = tryLogin(email, password);

        if (loggedIn) {
            // Proceed with login logic here
            setError('Login succesful!');
            //alert('Login successful!');
            navigate('/welcome', { state: { email } });
        } else {
            setError('Invalid email or password.');
        }

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
                    <label><input type="checkbox" />Remember me</label>
                    <a href="#">Forgot password?</a>
                </div>

                <button type="submit">Login</button>

                <div className="register-link">
                    <p>Don't have an account? <Link to="/register" className="link">Register</Link></p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm; 
