import React, { useState, useEffect } from 'react';
import './LoginForm.css';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaUser, FaLock } from "react-icons/fa";
import axios from 'axios';
import { useSessionUnauth } from './useSessionAuth.js';
import host from './host.json' with { type: 'json' };
// attempt to authenticate the account
async function tryAuth(email, authCode) {
    const response = await axios.post(host.domain + ':5000/auth-account', {
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
    useSessionUnauth();
    
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();      // get the url parameters
    const [email, setEmail] = useState('');     // the entered email
    const [authCode, setAuthCode] = useState('');       // the entered authentication code
    const [error, setError] = useState('');     // the error message

    const code = searchParams.get('code') || '';        // get the authentication code and email from URL
    const userEmail = searchParams.get('email') || '';
    useEffect(() => {       // set the fields automatically from URL (if available)
        setAuthCode(code);
        setEmail(userEmail);
    }, []);
    
    const handleSubmit = async (e) => {
        e.preventDefault();     // authenticate account

        let authed = await tryAuth(email, authCode);

        if (authed) {
            setError('Account verified!');
            navigate('/login');
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
