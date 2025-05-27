import React, {useEffect, useState} from 'react';
import Layout from './Layout';
import './GroupForum.css';
import { useLocation } from 'react-router-dom'
import axios from "axios";

async function createGroup (groupName, nameOfClass) {
    const response = await axios.post('http://localhost:5000/create-group', {
        "group_name": groupName,
        "class_name": nameOfClass
    }).catch(function (e) {
        console.log(e);
        return false;
    });
    return response.status === 204;
}

async function joinGroup (useremail, groupName, nameOfClass) {
    const response = await axios.post('http://localhost:5000/join-group', {
        "email": useremail,
        "group_name": groupName,
        "class_name": nameOfClass
    }).catch(function (e) {
        console.log(e);
        return false;
    });
    return response.status === 204;
}

async function leaveGroup (useremail, groupName, nameOfClass) {
    const response = await axios.post('http://localhost:5000/leave-group', {
        "email": useremail,
        "group_name": groupName,
        "class_name": nameOfClass
    }).catch(function (e) {
        console.log(e);
        return false;
    });
    return response.status === 204;
}

async function searchGroups () {
    const response = await axios.post('http://localhost:5000/list-groups', {

    }).catch(function (e) {
        console.log(e);
        return false;
    })
    if (response.status === 200) {
        if (response.data)
            return Object.values(response.data);
    }

    return false;
}

const GroupForum = () => {
    const location = useLocation();
    const data = location.state;
    const [name, setName] = useState('');
    const [className, setClass] = useState('');
    const [displayMessage, setMessage] = useState('');
    const onChangeGroup = (event) => {
        setName(event.target.value);
    };
    const onChangeClass = (event) => {
        setClass(event.target.value);
    };

    const handleCreate = async () => {
        let create = await createGroup(name, className)
        let join = await joinGroup(data.userEmail, name, className)
        if(create) {
            if(join)
            {
                setMessage("Group successfully created and joined!")
            }
            else {
                setMessage("Group created but error joining group")
            }
        }
        else
        {
            setMessage("Error creating group, perhaps a group by that name already exists")
        }

    };
    const handleSearch = async () => {
        let groups = await searchGroups()
        if(groups === false)
        {
            setMessage("Error finding groups")
        }
        else {
            setMessage("There is no group by that name")
            for (let i = 0; i < groups.length; i++) {
                if(groups[i].toString() === name)
                    setMessage("This group already exists")
            }
        }
    };
    const handleJoin = async () => {
        let join = await joinGroup(data.userEmail, name, className)
        if(join)
        {
            setMessage("Group successfully joined!")
        }
        else {
            setMessage("Error joining group, perhaps the group does not exist or you are already a member")
        }
    };
    const handleLeave = async () => {
        let join = await leaveGroup(data.userEmail, name, className)
        if(join)
        {
            setMessage("Group successfully left!")
        }
        else {
            setMessage("Error leaving group")
        }
    };

    return (
        <Layout>
            <h1>Group Forum!</h1>
            <p>This is the group forum for Study Buddy. Select an option from the sidebar.</p>
            <div className="search-container">
                <div className="search-inner">
                    <input
                        type="text"
                        value={className}
                        onChange={onChangeClass}
                        placeholder="Enter a class name..."
                    />
                    <input
                        type="text"
                        value={name}
                        onChange={onChangeGroup}
                        placeholder="Enter a group name..."
                    />
                    <button onClick={handleSearch}>Search</button>
                    <button onClick={handleCreate}>Create</button>
                    <button onClick={handleJoin}>Join</button>
                    <button onClick={handleLeave}>Leave</button>
                </div>
                <div className="displayMessage">
                    {displayMessage}
                </div>
            </div>
        </Layout>
    );
};

export default GroupForum;
