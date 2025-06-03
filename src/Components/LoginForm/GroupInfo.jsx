import { useLocation} from 'react-router-dom';
import {useEffect, useState} from 'react';
import axios from "axios";
import "./GroupInfo.css"
import Layout from './Layout';

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

async function getGroupInfo (groupName, className) {
    const response = await axios.post('http://localhost:5000/list-groups', {
        "token": localStorage.getItem("session")
    }).catch(function (e) {
        console.log(e);
        return false;
    });
    if (response.status === 200) {
        if (response.data) {
            let keys = Object.keys(response.data);
            let values = Object.values(response.data)
            for (let i = 0; i < values.length; i++) {
                if (values[keys[i]][0] === groupName && values[keys[i]][1] === className) {
                    return values[keys[i]];
                }
            }
        }
    }
    return false;
}

const GroupInfo = () => {
    const location = useLocation();
    const data = location.state;
    const [members, setMembers] = useState([])
    const [meetingTime, setMeetingTime] = useState('');
    const [meetingPlace, setMeetingPlace] = useState('');

    useEffect(() => {
        updateMembersList();

        updateGroupData();
    }, []);

    const updateGroupData = async () => {
        let groupData = await getGroupInfo(data.groupName, data.className);
        setMeetingTime(groupData[2]);
        setMeetingPlace(groupData[3]);
    }

    const updateMembersList = async () => {
        let membersList = await getMembers(data.groupName, data.className)
        if(membersList !== false)
        {
            let memberNames = []
            for (let i = 0; i < membersList.length; i++)
            {
                let name = await getNames(membersList[i].name)
                console.log(JSON.stringify(name))
                memberNames.push({id: membersList[i].id, display_name: name.display_name, email: name.email})
            }
            setMembers(memberNames)
        }
    }

    return (
        <Layout>
            <div className='info-section'>
                <div className='title-section'>
                    <h1>Study Group "{data.groupName}" in {data.className}</h1>
                    <hr />
                    <br />
                    {meetingTime? (<div>Meets at {meetingTime}</div>):(<></>)}
                    {meetingPlace? (<div>Meets in {meetingPlace}</div>):(<></>)}
                    <br />
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
        </Layout>
    )
};

export default GroupInfo;