import React, { useState } from 'react';
import Layout from './Layout';

// Sample course data
const courseData = [
    { id: 1, full_name: 'COEN 10 - Intro to Programming' },
    { id: 2, full_name: 'COEN 12 - Data Structures' },
    { id: 3, full_name: 'COEN 175 - Compilers' },
];

const AddCourse = () => {
    const [value, setValue] = useState('');
    const onChange = (event) => {
        setValue(event.target.value);
    };

    // Filter dropdown list based on input
    const filteredCourses = courseData.filter((course) =>
        course.full_name.toLowerCase().includes(value.toLowerCase())
    );

    return (
        <Layout>
            <h1>Add a Course!</h1>
            <div className="search-container">
                <div className="search-inner">
                    <input
                        type="text"
                        value={value}
                        onChange={onChange}
                        placeholder="Search for a course..."
                    />
                </div>
                {value && (
                    <div className="dropdown">
                        {filteredCourses.map((item) => (
                            <div key={item.id} className="dropdown-row">
                                {item.full_name}
                            </div>
                        ))}
                        {filteredCourses.length === 0 && (
                            <div className="dropdown-row">No matching courses</div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default AddCourse;