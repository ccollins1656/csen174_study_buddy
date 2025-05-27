// AddCourse.jsx
import Layout from './Layout';
import courseData from './courseData_output.json' with { type: 'json' };
import { useState } from 'react';
import "./AddCourse.css";
import { useSessionAuth } from './useSessionAuth.js';
import { useGetCourses, useUpdateCourses } from './useCourseManagement.js';


const AddCourse = () => {
    const [value, setValue] = useState('');
    const [yourCourses, setYourCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    useSessionAuth();
    useGetCourses(setYourCourses);
    const updateCourses = useUpdateCourses(setYourCourses);

    const onChange = (event) => {
        setValue(event.target.value);
    };

    // Filter dropdown list based on input
    const filteredCourses = courseData.courses.filter((course) =>
        course.full_name.toLowerCase().includes(value.toLowerCase())
    );

    const handleSelect = (course) => {
        if (!yourCourses.find(c => c.id === course.id)) {
            const updatedCourses = [...yourCourses, course];
            updateCourses(updatedCourses);
        }
        setSearchTerm('');
    };


    return (
        <Layout>
            <h1>Add a Course</h1>
            <hr></hr>
            <br></br>
            <div className="search-container">
                    <input
                        type="text"
                        value={value}
                        onChange={onChange}
                        placeholder="Search for a course..."
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            fontSize: '1.0rem',
                            padding: '0.75rem 1rem',
                            width: '600px',
                            marginTop: '2rem', // move it lower
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                        }}
                    />
                {value && (
                    <div className="dropdown">
                        {filteredCourses.slice (0, 4).map((item) => (
                            <div key={item.id} className="dropdown-row" onClick={() => handleSelect(item)} style={{ cursor: 'pointer' }}>
                                {item.full_name}
                            </div>
                        ))}
                        {filteredCourses.length === 0 && (
                            <div className="dropdown-row">No matching courses</div>
                        )}
                    </div>
                )}
            </div>
            <div className="current-courses">
                <h2 style={{ marginTop: '30vh' }}>Your Courses</h2>
                <hr />
                <br />
                <div className="course-grid">
                    {yourCourses.length ? yourCourses.map(course => (
                        <div key={course.id} className="course-card">
                            <h3>{course.full_name}</h3>
                            {/* Add more info/buttons here if needed */}
                        </div>
                    )) : <div></div>}
                </div>
            </div>
        </Layout>
    );
};

export default AddCourse;