import { useState, useEffect } from 'react';
import Layout from './Layout';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSessionAuth } from './useSessionAuth.js';
import host from './host.json' with { type: 'json' };

// returns the list of all groups that the use is in (user provided by email stored in session token)
async function searchGroups () {
    const response = await axios.post(host.domain + ':5000/list-groups', {
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

// attempts to create a group based on the information passed in
async function tryCreateGroup (groupName, className, meetingTime, meetingPlace) {
    const response = await axios.post(host.domain + ':5000/create-group', {
        "token": localStorage.getItem("session"),
        "group_name": groupName,
        "class_name": className,
        "meeting_time": meetingTime,
        "meeting_place": meetingPlace
    }).catch(function (e) {
        console.log(e);
        return false;
    });
    return response.status === 204;
}

// attempts to join specified group based on info passed in
async function tryJoinGroup (groupName, className) {
    const response = await axios.post(host.domain + ':5000/join-group', {
        "token": localStorage.getItem("session"),
        "group_name": groupName,
        "class_name": className
    }).catch(function (e) {
        console.log(e);
        return false;
    });
    return response.status === 204;
}


const GroupCreate = () => {
    const [className, setClassName] = useState('');         // name of class selected
    const [groupName, setGroupName] = useState('');         // name of group selected
    const [displayMessage, setDisplayMessage] = useState('');       // the info message for user
    const [meetingTime, setMeetingTime] = useState('');         // meeting time for the group
    const [meetingPlace, setMeetingPlace] = useState('');       // meeting place for the group
    const location = useLocation();
    const state = location.state;               // info passed in from previous page

    useSessionAuth();
    
    const navigate = useNavigate();
    useEffect(() => {
        if (!state || !state.redirected) {
            // This page should only be accessible if redirected with state.
            navigate('/groupforum');
        } else {
            // Fill state variables with passed state.
            setClassName(state.className);
            setGroupName(state.groupName);
        }
    }, []);

    const onChangeGroup = async (event) => {
        setGroupName(event.target.value);
        let groups = await searchGroups();
        // Warn if group name already taken for this class
        for (let i = 0; i < groups.length; i++) {
            if(groups[i][0].toLowerCase().includes(groupName.toLowerCase()) && groups[i][1].toLowerCase() === className.toLowerCase()) {
                setDisplayMessage('Group name taken!');
            } else {
                setDisplayMessage('');
            }
        }
    };

    const createGroup = async (e) => {
        e.preventDefault();     // create the group
        let done = await tryCreateGroup(groupName, className, meetingTime, meetingPlace);
        if (!done) {
            setDisplayMessage('Group could not be created.');
            return;
        }
        done = await tryJoinGroup(groupName, className);        // join the new group
        if (!done) {
            setDisplayMessage('Group created, but could not join.');
            return;
        }
        setDisplayMessage('Group successfully created and joined.');        // move to group info page
        navigate('/groupinfo', { state: { groupName: groupName, className: className, meetingTime: meetingTime, meetingPlace: meetingPlace }})
    }

    return (
        <Layout>
            <form onSubmit={createGroup}>
                <h1>Create Study Group</h1>
                <hr />
                <br />
                <h3>Class Name</h3>
                <div className="search-class">
                    <input
                        type="text"
                        value={className}
                        placeholder="Class Name"
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
                            background: 'white',
                            color: 'inherit',
                        }}
                        disabled
                    />
                </div>
                <br />
                <h3>Group Name<a style={{color: 'red'}}>*</a></h3>
                <div className="search-group">
                    <input
                        type="text"
                        value={groupName}
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
                </div>
                <br />
                <br />
                <h4>Meeting Times</h4>
                <div className="set-meeting-time">
                    <input
                        type="text"
                        value={meetingTime}
                        onChange={(e) => setMeetingTime(e.target.value)}
                        placeholder="Monday @ 3:00 pm..."
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
                </div>
                <br />
                <h4>Meeting Location</h4>
                <div className="set-meeting-place">
                    <input
                        type="text"
                        value={meetingPlace}
                        onChange={(e) => setMeetingPlace(e.target.value)}
                        placeholder="Heafey Atrium..."
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
                </div>
                <br />
                <button type="submit">Create Group</button>
                <br />
                <div className="displayMessage">
                    {displayMessage}
                </div>
            </form>
        </Layout>
    )
};

export default GroupCreate;