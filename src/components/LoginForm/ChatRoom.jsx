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
        axios
        .get(`http://localhost:5001api/messages/${courseId}`)
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
            sender: 'You',
            courseId,
        };

        try {
            await axios.post('http://localhost:5001/api/messages', {
                text: messageInput,
                sender: 'user123', // Use the actual user_id here
                courseId           // This is fine as it maps to class_name
            });
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    return (
        <Layout>
            <div className="chatroom-conatiner" style={{ padding: '2rem' }}>
                <h1>{courseId}</h1>
                <hr />
                <br />

                <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                    {Array.isArray(messages) ? messages.map((msg, index) => (
                        <div key={index}>{msg.user_id}: {msg.text}</div>
                    )) : <p>No messages to display</p>}
                </div>

                <div className="chat-input">
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
