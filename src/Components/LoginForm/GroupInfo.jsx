import { useLocation} from 'react-router-dom';
import {useEffect, useState} from 'react';
import axios from "axios";
import "./GroupInfo.css"
import Layout from './Layout';
import host from './host.json' with { type: 'json' };

async function getMembers (groupName, className) {
    const response = await axios.post(host.domain + ':5000/find-group-members', {
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
    const response = await axios.post(host.domain + ':5000/get-user-view', {
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
    const response = await axios.post(host.domain + ':5000/list-groups', {
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

/*
    Calls the flask server to get the group messages from the database.
*/
async function getGroupMessages (group, className) {
    const response = await axios.post(host.domain + ':5000/get-group-messages', {
        "token": localStorage.getItem("session"),
        "groupName": group,
        "className": className
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

/*
    Calls the flask server to send a group message and put message in database.
*/
async function sendGroupMessage (group, className, sender, text) {
    const response = await axios.post(host.domain + ':5000/send-group-message', {
        "token": localStorage.getItem("session"),
        "groupName": group,
        "className": className,
        "senderEmail": sender,
        "text": text
    }).catch(function (e) {
        console.log(e);
        return false;
    })
    if (response.status === 204) {
        return true;
    }

    return false;
}

const GroupInfo = () => {
    const location = useLocation();
    const data = location.state;                            // stores data passed from prev. page
    const [members, setMembers] = useState([])              // members of group
    const [meetingTime, setMeetingTime] = useState('');     // group meeting time
    const [meetingPlace, setMeetingPlace] = useState('');   // group meeting place
    const [newMessage, setNewMessage] = useState('');       // the messages entered in input field
    const [messages, setMessages] = useState([]);           // displayed messages
    const [senderEmail, setSenderEmail] = useState('');     // the user's email

    useEffect(() => {
        updateMembersList();

        updateGroupData();

        const storedUser = JSON.parse(localStorage.getItem('currentUser'));
        if (storedUser && storedUser.email) {
          setSenderEmail(storedUser.email); // Use email
        }
        refreshMessages();
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

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        // send the message
        await sendGroupMessage(data.groupName, data.className, senderEmail, newMessage);
        setNewMessage('');
    };

    const refreshMessages = async () => {
        const allMessages = await getGroupMessages(data.groupName, data.className);
        let messages = [];
        let origin = "";
        console.log(allMessages);
        //format the messages in json that can be displayed
        for(let i = 0; i < allMessages.length; i++)
        {
            if(senderEmail == allMessages[i][2])  // this case we sent the message
            {
                origin = "mine";
            }
            else                                    // someone else send the message
            {
                origin = "other";
            }

            const newMsg = {
                text: allMessages[i][4],
                sender: allMessages[i][2] || 'Anonymous',
                origin: origin,
                timestamp: allMessages[i][3],
            };
            messages.push(newMsg);
        }
        setMessages(messages);
    }

    const refresh = async (e) => {
        e.preventDefault();
        await refreshMessages();
    };

    /*
    This useEffect will periodically refresh the messages in case any arrive
    Polling > holding a connection because it means I don't have to learn to use socket-io
    What does efficiency even matter anyways...
    */
    useEffect(() => {
    const intervalId = setInterval(() => {
        (async () => {
            try {
                // refresh to show messages with recipient
                await refreshMessages();
            } catch (error) {
                console.error("Error messages:", error);
            }
        })();
    }, 1000);

    return () => {
        clearInterval(intervalId)
    };
    }, [senderEmail]);      // refreshMessages relies on the sender email to be correct

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
                                <div className="name-display">Name: {group.display_name}</div>
                                <div className="email-display">Email: {group.email}</div>
                                {/* Add more info/buttons here if needed */}
                            </div>
                        ))}
                    </div>
                )}
                </div>
            </div>
            <div className="message-container">

            <h1>Message Group!</h1>
            <form onSubmit={handleSendMessage} className="message-form">
                <textarea
                    placeholder="Type your message here..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={refresh}>Refresh</button>
                <button type="submit">Send</button>
            </form>

            <div className="messages-list">
                <h2>Messages</h2>
                {messages.length === 0 ? (
                    <p>No messages yet. Start a conversation!</p>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={`message-item ${msg.origin.toLowerCase()}`}>
                            <p><strong>{msg.sender}:</strong> {msg.text}</p>
                            <small>{msg.timestamp}</small>
                        </div>
                    )
                ))}
            </div>
            </div>
        </Layout>
    )
};

export default GroupInfo;