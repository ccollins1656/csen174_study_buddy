// WelcomePage.jsx
import React from 'react';
import { useSessionAuth } from './useSessionAuth.js';
import Layout from './Layout.jsx';
import { useEffect, useState } from 'react';
import "./WelcomePage.css";
import { Link } from 'react-router-dom';


const WelcomePage = () => {
    useSessionAuth();

    const [yourCourses, setYourCourses] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('yourCourses');
        if (saved) {
            setYourCourses(JSON.parse(saved));
        }
    }, []); 

    const handleRemove = (id) => {
        const updated = yourCourses.filter((c) => c.id !== id);
        setYourCourses(updated);
        localStorage.setItem('yourCourses', JSON.stringify(updated));
    };


    return (
        <Layout>
            <h1>Dashboard</h1>
            <hr />
            <br />
            {yourCourses.length === 0 ? (
                <p></p>
        ) : (
            <div className="course-grid">
                {yourCourses.map(course => (
                    <Link to={`/chat/${course.full_name}`} key={course.full_name} style={{ textDecoration: 'none' }}>
                        <div key={course.id} className="course-card">
                            <button
                                className="remove-btn"
                                onClick={() => handleRemove(course.id)}
                                aria-label="Remove Course"
                            >
                                &times;
                            </button>
                            <h3>{course.full_name}</h3>
                            {/* Add more info/buttons here if needed */}
                        </div>
                    </Link>
                ))}
            </div>
        )}
        </Layout>
    );
};

export default WelcomePage;

