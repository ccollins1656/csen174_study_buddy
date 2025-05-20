import React from 'react';
import { useState } from 'react';
import Layout from './Layout';

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
                    {data.map((item) => (
                        <div className="dropdown-row">{item.full_name}</div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default AddCourse;