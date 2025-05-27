import React, {useState, useEffect} from 'react';
import Layout from './Layout';
import './GroupForum.css';
import axios from "axios";
import { Link } from 'react-router-dom';

async function getCurrentGroupList(){
    const response = await axios.post('http://localhost:5000/find-groups', {
        "token": localStorage.getItem("session")
    }).catch(function (e) {
       console.log(e);
       return false;
    });
    if (response.status === 200) {
        if (response.data)
        {
            let result = []
            for (let i = 0; i < response.data.length; i++) {
                result.push({
                    id: i,
                    groupName: response.data[i][0],
                    className: response.data[i][1]
                });
            }
            return result;
        }
    }
    return false;
}

async function createGroup (groupName, nameOfClass) {
    const response = await axios.post('http://localhost:5000/create-group', {
        "token": localStorage.getItem("session"),
        "group_name": groupName,
        "class_name": nameOfClass
    }).catch(function (e) {
        console.log(e);
        return false;
    });
    return response.status === 204;
}

async function joinGroup (groupName, nameOfClass) {
    const response = await axios.post('http://localhost:5000/join-group', {
        "token": localStorage.getItem("session"),
        "group_name": groupName,
        "class_name": nameOfClass
    }).catch(function (e) {
        console.log(e);
        return false;
    });
    return response.status === 204;
}

async function leaveGroup (groupName, nameOfClass) {
    const response = await axios.post('http://localhost:5000/leave-group', {
        "token": localStorage.getItem("session"),
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
        "token": localStorage.getItem("session")
    }).catch(function (e) {
        console.log(e);
        return false;
    })
    if (response.status === 200) {
        if (response.data) {
            let result = []
            for (let i = 0; i < response.data.length; i++) {
                result.push({
                    id: i,
                    groupName: response.data[i][0],
                    className: response.data[i][1]
                });
            }
            return result;
        }
    }

    return false;
}

const GroupForum = () => {
    const [name, setName] = useState('');
    const [className, setClass] = useState('');
    const [displayMessage, setMessage] = useState('');
    const [yourGroups, setGroups] = useState([])

    useEffect(() => {
        updateGroupsList();
    }, []);

    const onChangeGroup = (event) => {
        setName(event.target.value);
    };
    const onChangeClass = (event) => {
        setClass(event.target.value);
    };

    const updateGroupsList = async () => {
        let groupList = await getCurrentGroupList()
        if(groupList !== false)
        {
            setGroups(groupList)
        }
    }

    const handleCreate = async () => {
        let create = await createGroup(name, className)
        if(create) {
            let join = await joinGroup(name, className)
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
        await updateGroupsList()
    };
    const handleSearch = async () => {
        let groups = await searchGroups()
        if(groups === false)
        {
            setMessage("Error finding groups")
        }
        else {
            setMessage("There is no group by that name in class: " + className)
            console.log(groups)
            for (let i = 0; i < groups.length; i++) {
                if(groups[i].groupName === name && groups[i].className === className)
                    setMessage("This group already exists in class: " + className)
            }
        }
    };
    const handleJoin = async () => {
        let join = await joinGroup(name, className)
        if(join)
        {
            setMessage("Group successfully joined!")
        }
        else {
            setMessage("Error joining group, perhaps the group does not exist or you are already a member")
        }
        await updateGroupsList()
    };
    const handleLeave = async () => {
        let join = await leaveGroup(name, className)
        if(join)
        {
            setMessage("Group successfully left!")
        }
        else {
            setMessage("Error leaving group")
        }
        await updateGroupsList()
    };

    return (
        <Layout>
            <h1>Group Forum!</h1>
            <p>This is the group forum for Study Buddy. Enter a class and group name to get started.</p>
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
            <div className="current-groups">
                <h2 style={{ marginTop: '30vh' }}>Your Groups</h2>
                <hr />
                <br />
                {yourGroups.length === 0 ? (
                    <p></p>
                ) : (
                    <div className="group-grid">
                        {yourGroups.map(group => (
                            <Link to={'/groupinfo'} key={group.id} style={{ textDecoration: 'none', color: 'inherit' }} state={{groupName: group.groupName, className: group.className}}>
                                <div key={group.id} className="group-card">
                                    <h3>Class: {group.className}</h3>
                                    <h3>Group: {group.groupName}</h3>
                                    {/* Add more info/buttons here if needed */}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default GroupForum;
