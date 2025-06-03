import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import './Message.css';
import tutors from './tutors_listOutput.json' with { type: 'json' };

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderRole, setSenderRole] = useState('Student');

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
    setMessages(storedMessages);

    // Load current user email from localStorage
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser && storedUser.email) {
      setSenderName(storedUser.email.split('@')[0]); // Use email prefix as name
    }
    for(let i = 0; i < tutors.tutorData.length; i++)
    {
        if(tutors.tutorData[i].tutorName === storedUser.email)
        {
            setSenderRole("Tutor");
        }
    }
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const newMsg = {
      text: newMessage,
      sender: senderName || 'Anonymous',
      role: senderRole,
      timestamp: new Date().toLocaleString(),
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    localStorage.setItem('messages', JSON.stringify(updatedMessages));
    setNewMessage('');
  };

  return (
    <Layout>
      <div className="message-container">
        <h1>Message Tutor/Student!</h1>

        <form onSubmit={handleSendMessage} className="message-form">
          <label>Your Role:</label>
          <select value={senderRole} onChange={(e) => setSenderRole(e.target.value)}>
            <option value="Student">Student</option>
            <option value="Tutor">Tutor</option>
          </select>

          <textarea
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />

          <button type="submit">Send</button>
        </form>

        <div className="messages-list">
          <h2>Messages</h2>
          {messages.length === 0 ? (
            <p>No messages yet. Start a conversation!</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`message-item ${msg.role.toLowerCase()}`}>
                <p><strong>{msg.sender} ({msg.role}):</strong> {msg.text}</p>
                <small>{msg.timestamp}</small>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Message;
