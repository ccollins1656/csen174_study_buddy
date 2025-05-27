import { useLocation} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import axios from "axios";
import "./GroupInfo.css"

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

async function getNames (userid) {
    const response = await axios.post('http://localhost:5000/get-user-view', {
        "token": localStorage.getItem("session"),
        "user_id": userid
    }).catch(function (e) {
        console.log(e);
        return false;
    });
    if (response.status === 200) {
        if (response.data)
        {
            return response.data;
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
            let memberNames = []
            console.log(membersList)
            for (let i = 0; i < membersList.length; i++)
            {
                let name = await getNames(membersList[i].name)
                console.log(JSON.stringify(name))
                memberNames.push({id: membersList[i].id, display_name: name.display_name, email: name.email})
            }
            console.log(memberNames)
            setMembers(memberNames)
        }
    }

    return (
        <div className='info-section'>
            <div className='title-section'>
                <h1>This is the info for group: {data.groupName} in class: {data.className}</h1>
                <div>
                    <h3>Members of this group:</h3>
                </div>
            </div>
            <div className='names-section'>
                {members.length === 0 ? (
                <p></p>
                ) : (
                <div className="member-grid">
                    {members.map(group => (
                        <div key={group.id} className="member-card">
                            <div>Name: {group.display_name}</div>
                            <div>Email: {group.email}</div>
                            {/* Add more info/buttons here if needed */}
                        </div>
                    ))}
                </div>
            )}
            </div>
        </div>
    )
};

export default GroupInfo;