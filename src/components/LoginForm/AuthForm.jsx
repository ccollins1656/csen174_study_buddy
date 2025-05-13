import React, { useState } from 'react';
import './LoginForm.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from "react-icons/fa";
import axios from 'axios';

async function tryAuth(email, authCode) {
    const response = await axios.post('http://localhost:5000/auth', {
        "email": email,
        "auth_code": authCode
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

const AuthForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [authCode, setAuthCode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        let authed = tryAuth(email, authCode);

        if (authed) {
            setError('Account verified!');
            navigate('/');
        } else {
            setError('Account authentication could not be completed. Try again or request a new code.');
        }

    };

    return (
            <div className='wrapper'>
                <form onSubmit={handleSubmit}>
                    <h1>Study Buddy Email Verification</h1>
    
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
                            placeholder='Auth Code'
                            value={authCode}
                            onChange={(e) => setAuthCode(e.target.value)}
                            required
                        />
                        <FaLock className='icon' />
                    </div>
    
                    {error && <p className="error-message">{error}</p>}
    
                    <button type="submit">Verify Email</button>
    
                    <div className="register-link">
                        <p>Don't have an account? <Link to="/register" className="link">Register</Link></p>
                    </div>
                </form>
            </div>
        );
};

export default AuthForm;
