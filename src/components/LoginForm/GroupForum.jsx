import React, {useState, useEffect} from 'react';
import Layout from './Layout';
import courseData from './courseData_output.json' with { type: 'json' };
import './GroupForum.css';
import axios from "axios";
import { Link } from 'react-router-dom';
import { useSessionAuth } from './useSessionAuth.js';

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
        if (response.data)
            return response.data;
    }

    return false;
}

const GroupForum = () => {
    const [name, setName] = useState('');
    const [className, setClass] = useState('');
    const [displayMessage, setMessage] = useState('');
    const [yourGroups, setYourGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);

    useSessionAuth();

    useEffect(() => {
        updateGroupsList();
    }, []);

    const onChangeGroup = async (event) => {
        setName(event.target.value);
        let groups = await searchGroups();
        // Filter dropdown list based on input
        let filtered = [];
        for (let i = 0; i < groups.length; i++) {
            if(groups[i][0].toLowerCase().includes(name.toLowerCase()) && groups[i][1].toLowerCase() === className.toLowerCase()) {
                filtered.push({
                    id: i,
                    groupName: groups[i][0],
                    className: groups[i][1]
                    });
            }
        }
        setFilteredGroups(filtered);
    };

    const onChangeClass = (event) => {
        setClass(event.target.value);
        setFilteredGroups([{id:0, groupName: "Search out of date", className: ""}]);
    };

    const updateGroupsList = async () => {
        let groupList = await getCurrentGroupList();
        if(groupList !== false) {
            setYourGroups(groupList);
        }
    }

    const handleCreate = async () => {
        let create = await createGroup(name, className);
        if(create) {
            let join = await joinGroup(name, className);
            if(join) {
                setMessage("Group successfully created and joined!");
            }
            else {
                setMessage("Group created but error joining group");
            }
        }
        else
        {
            setMessage("Error creating group, perhaps a group by that name already exists");
        }
        await updateGroupsList();
    };

    const handleSearch = async () => {
        let groups = await searchGroups();
        if(groups === false) {
            setMessage("Error finding groups");
        }
        else {
            console.log(groups);
            console.log(name);
            setMessage("There is no group by that name in class: " + className);
            for (let i = 0; i < groups.length; i++) {
                if(groups[i][0] === name && groups[i][1] === className) {
                    setMessage("This group already exists in class: " + className);
                }
            }
        }
    };

    const handleJoin = async () => {
        let join = await joinGroup(name, className);
        if(join) {
            setMessage("Group successfully joined!");
        }
        else {
            setMessage("Error joining group, perhaps the group does not exist or you are already a member");
        }
        await updateGroupsList();
    };

    const handleLeave = async () => {
        let join = await leaveGroup(name, className);
        if(join) {
            setMessage("Group successfully left!");
        }
        else {
            setMessage("Error leaving group");
        }
        await updateGroupsList();
    };

    const handleRemoveClick = async (e, groupName, className) => {
        e.preventDefault();
        let leave = await leaveGroup(groupName, className);
        if(leave) {
            setMessage("Group successfully left!");
        }
        else {
            setMessage("Error leaving group");
        }
        await updateGroupsList();
    };

    // Filter dropdown list based on input
    const filteredCourses = courseData.courses.filter((course) =>
        course.full_name.toLowerCase().includes(className.toLowerCase())
    );

    return (
        <Layout>
            <h1>Group Forum!</h1>
            <p>This is the group forum for Study Buddy. Enter a class and group name to get started.</p>
            <div className="search-container">
                <div className="search-inner">
                    <div className="search-class">
                        <input
                            type="text"
                            value={className}
                            onChange={onChangeClass}
                            placeholder="Enter a class name..."
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                fontSize: '1.0rem',
                                padding: '0.75rem 1rem',
                                width: '600px',
                                marginTop: '0rem',
                                borderRadius: '6px',
                                border: '1px solid #ccc',
                            }}
                        />
                        {className && (
                            <div className="dropdown">
                                {filteredCourses.slice (0, 4).map((item) => (
                                    <div key={item.id} className="dropdown-row" onClick={() => {setClass(item.full_name); setFilteredGroups([{id:0, groupName: "Search out of date", className: ""}])}} style={{ cursor: 'pointer' }}>
                                        {item.full_name}
                                    </div>
                                ))}
                                {filteredCourses.length === 0 && (
                                    <div className="dropdown-row">No matching courses</div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="search-group">
                        <input
                            type="text"
                            value={name}
                            onChange={onChangeGroup}
                            onClick={onChangeGroup}
                            placeholder="Enter a group name..."
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                fontSize: '1.0rem',
                                padding: '0.75rem 1rem',
                                width: '600px',
                                marginTop: '0.5rem',
                                borderRadius: '6px',
                                border: '1px solid #ccc',
                            }}
                        />
                        {className && (
                            <div className="dropdown">
                                {filteredGroups.slice (0, 4).map((item) => (
                                    <div key={item.id} className="dropdown-row" onClick={() => {setName(item.groupName)}} style={{ cursor: 'pointer' }}>
                                        {item.groupName}
                                    </div>
                                ))}
                                {filteredGroups.length === 0 && (
                                    <div className="dropdown-row">No matching groups in class: {className}</div>
                                )}
                            </div>
                        )}
                    </div>
                    <br />
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
                                    <button
                                        className="remove-group-btn"
                                        onClick={(e) => handleRemoveClick(e, group.groupName, group.className)}
                                        aria-label="Leave Group"
                                    >
                                        &times;
                                    </button>
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
