import Layout from './Layout.jsx'; 
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import "./ChatRoom.css";
import axios from 'axios';
import io from "socket.io-client";
import host from './host.json' with { type: 'json' };


const socket = io(host.domain + ":5001", {transports: ['websocket']});
async function getIdFromEmail () {
    const response = await axios.post(host.domain + ':5000/get-id-from-email', {
        "token": localStorage.getItem("session")
    })
    if (response.status === 200) {
        if (response.data)
            console.log(response.data);
            return response.data;
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

const ChatRoom = () => {
    const { courseId } = useParams();
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const chatEndRef = useRef(null);
    const [userId, setUserId] = useState(null);
    const [idTODisNameDict, setDispMap] = useState(new Map());       // stores user_id to display_name mappings for every id we encounter
    const [messagesWithNames, setMessagesWithNames] = useState([]); // stores messages with display names

    useEffect(() => {
        (async () => {
            try {
                const user_num = await getIdFromEmail();
                setUserId(user_num);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        })();
        axios.get(host.domain + `:5001/api/messages/${courseId}`)
        .then(res => {
            console.log("Fetched Messages:", res.data);
            setMessages(res.data);
        })
        .catch(err => console.error('Error fetching messages:', err));
        
        // scroll to bottom when opening messages page
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [courseId]);

    useEffect(() => {
        socket.emit('joinRoom', courseId);

        socket.on('newMessage', (message) => {
            setMessages(prev => [...prev, message]);
        });

        return () => {
            socket.off('newMessage');
        };
    }, [courseId]);
    
    const handleSend = async () => {
        if (!messageInput.trim()) return;

        const newMessage = {
            text: messageInput,
            user_id: userId,
            class_name: courseId,
            token: localStorage.getItem("session"),
        };

        try {
            await axios.post(host.domain + ':5001/api/messages', newMessage);
            setMessageInput('');
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };



    useEffect(() => {
        (async () => {
        try {
            let tempMap = new Map(idTODisNameDict);
            let tempMsgWithName = messages;
            for(let i = 0; i < messages.length; i++)        // update the display names dictionary
            {
                if(typeof tempMap.get(messages[i].user_id) === 'undefined')
                {
                    const senderNames = await getNames(messages[i].user_id);
                    tempMap.set(messages[i].user_id, senderNames.display_name);
                }
                tempMsgWithName[i].dispName = tempMap.get(tempMsgWithName[i].user_id)
                console.log(tempMap);
                console.log(tempMsgWithName[i].dispName);
                console.log(tempMsgWithName[i].user_id);
            }
            setDispMap(tempMap);
            console.log(idTODisNameDict);
            setMessagesWithNames(tempMsgWithName);
            console.log(messagesWithNames);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
        })();
    }, [messages]);

    // scroll to bottom when new message appears
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messagesWithNames]);
    
    return (
        <Layout>
            <div className="chatroom-container" style={{ padding: '2rem' }}>
                <h1>{courseId}</h1>
                <hr />
                <br />
                <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                    {Array.isArray(messagesWithNames) ? messagesWithNames.map((msg, index) => (
                        <div key={index} className={`message-wrapper ${msg.user_id === userId ? 'own' : 'other'}`}>

                            <div className="sender-label">{msg.dispName}</div>
                            <div ref={chatEndRef} className={`message-bubble ${msg.user_id === userId ? 'own-message' : 'other-message'}`}>
                                {msg.text}
                            </div>
                        </div>


                    )) : <p>No messages to display</p>}
                </div>

                <div className="chat-input-container">
                    <input
                        type="text"
                        className="chat-input"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button onClick={handleSend}>Send</button>
                </div>
            </div>
        </Layout>
    );
};

export default ChatRoom;
