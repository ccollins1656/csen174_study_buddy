import Layout from './Layout.jsx'; 
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import "./ChatRoom.css";
import axios from 'axios';
import io from "socket.io-client";


const socket = io("http://localhost:5001");

const ChatRoom = () => {
    const { courseId } = useParams();
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const chatEndRef = useRef(null);

    useEffect(() => {
        axios.get(`http://localhost:5001/api/messages/${courseId}`)
        .then(res => {
            console.log("Fetched Messages:", res.data);
            setMessages(res.data);
        })
        .catch(err => console.error('Error fetching messages:', err));
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
            user_id: 0,
            class_name: courseId
        };

        try {
            await axios.post('http://localhost:5001/api/messages', newMessage);
            setMessageInput('');
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };



    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    return (
        <Layout>
            <div className="chatroom-container" style={{ padding: '2rem' }}>
                <h1>{courseId}</h1>
                <hr />
                <br />

                <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                    {Array.isArray(messages) ? messages.map((msg, index) => (
                        <div key={index} className={`message-bubble ${msg.user_id === 0 ? 'own-message' : 'other-message'}`}>
                            <strong>{msg.user_id}</strong>: {msg.text}
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
