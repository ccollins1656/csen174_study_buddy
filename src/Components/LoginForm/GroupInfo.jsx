import {Link, useLocation} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import axios from "axios";

async function getMembers (groupName, className) {
    const response = await axios.post('http://localhost:5000/find-group-members', {
        "token": localStorage.getItem("session"),
        "group_name": groupName,
        "class_name": className
    }).catch(function (e) {
        console.log(e);
        return false;
    });
    if (response.status === 200) {
        if (response.data)
        {
            let keys = Object.keys(response.data)
            let values = Object.values(response.data)
            let result = []
            for (let i = 0; i < values.length; i++) {
                result.push({id: keys[i], name: values[i]})
            }
            return result;
        }
    }
    return false;
}

const GroupInfo = () => {
    const location = useLocation();
    const data = location.state;
    const [members, setMembers] = useState([])

    useEffect(() => {
        updateMembersList();
    }, []);

    const updateMembersList = async () => {
        let membersList = await getMembers(data.groupName, data.className)
        if(membersList !== false)
        {
            setMembers(membersList)
        }
    }

    return (
        <div className='info-section'>
            <h1>This is the info for group: {data.groupName} in class: {data.className}</h1>
            <div>
                <h3>Members of this group:</h3>
                <div>
                    {members.length === 0 ? (
                    <p></p>
                    ) : (
                    <div className="group-grid">
                        {members.map(group => (
                            <div key={group.id} className="group-card">
                                <h3>{group.name}</h3>
                                {/* Add more info/buttons here if needed */}
                            </div>
                        ))}
                    </div>
                )}
                </div>
            </div>
        </div>
    )
};

export default GroupInfo;