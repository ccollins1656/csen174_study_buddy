// WelcomePage.jsx
import { useSessionAuth } from './useSessionAuth.js';
import { useGetCourses, useUpdateCourses } from './useCourseManagement.js';
import Layout from './Layout.jsx';
import { useState } from 'react';
import "./WelcomePage.css";
import { Link } from 'react-router-dom';


const WelcomePage = () => {
    const [yourCourses, setYourCourses] = useState([]);
    
    useSessionAuth();
    useGetCourses(setYourCourses);
    const updateCourses = useUpdateCourses(setYourCourses);

    const handleRemove = (e, id) => {
        e.preventDefault();
        const updated = yourCourses.filter((c) => c.id !== id);
        updateCourses(updated);
    };


    return (
        <Layout>
            <h1>Dashboard</h1>
            <hr />
            <br />
            <div className="course-grid">
                {yourCourses.length ? yourCourses.map(course => (
                    <Link to={`/chat/${course.id}`} key={course.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div key={course.id} className="course-card">
                            <button
                                className="remove-btn"
                                onClick={(e) => handleRemove(e, course.id)}
                                aria-label="Remove Course"
                            >
                                &times;
                            </button>
                            <h3>{course.full_name}</h3>
                            {/* Add more info/buttons here if needed */}
                        </div>
                    </Link>
                )) : <div></div>}
            </div>
        </Layout>
    );
};

export default WelcomePage;
