// WelcomePage.jsx
import { useSessionAuth } from './useSessionAuth.js';
import { useGetCourses, useUpdateCourses } from './useCourseManagement.js';
import Layout from './Layout.jsx';
import { useEffect, useState } from 'react';
import "./WelcomePage.css";
import { Link } from 'react-router-dom';


const WelcomePage = () => {
    useSessionAuth();

    const [yourCourses, setYourCourses] = useState([]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('yourCourses');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setYourCourses(parsed);
                }
            }
        } catch (err) {
            console.error("Failed to parse 'yourCourses' from localStorage", err);
            localStorage.removeItem('yourCourses'); // optional cleanup
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
                    <Link to={`/chat/${course.full_name}`} key={course.id} style={{ textDecoration: 'none' }}>
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