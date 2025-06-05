import React, { useState, useEffect } from 'react';
import './LoginForm.css';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import axios from 'axios';
import { useSessionUnauth } from './useSessionAuth.js';
import host from './host.json' with { type: 'json' };

async function tryReset(email) {
    const response = await axios.post(host.domain + ':5000/reset-password', {
        "email": email
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

const ForgotForm = () => {
    useSessionUnauth();

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        let authed = await tryReset(email);

        if (authed) {
            setError('Password Reset! Check your inbox for your new password!');
            navigate('/login');
        } else {
            setError('Email was not recognized. Make sure it has been typed in correctly!');
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

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit">Reset Password</button>

                    <div className="register-link">
                        <p>Don't have an account? <Link to="/register" className="link">Register</Link></p>
                    </div>
                </form>
            </div>
        );
};

export default ForgotForm;