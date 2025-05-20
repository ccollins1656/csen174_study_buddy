import React from 'react';
import { useState } from 'react';
import Layout from './Layout';
var data = require("./courses_offered.csv");

const AddCourse = () => {
    const [value, setValue] = useState('');

    const onChange = (event) => {
        setValue(event.target.value);
    }

    return (
        <Layout>
            <h1>Add a Course!</h1>
            <div className="search-container">
                <div className="search-inner">
                    <input type="text" value={value} onChange={onChange} placeholder="Search for a course..." />
                </div>
                <div className="dropdown">
                    {data.filter(item => {
                        const searchTerm = value.toLowerCase()
                        const course = item.toLowerCase();

                    return searchTerm && course.startsWith(searchTerm) && course !== searchTerm
                    }).slice(0,5)
                    .map((item) => (
                        <div className="dropdown-row">{item}</div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default AddCourse;