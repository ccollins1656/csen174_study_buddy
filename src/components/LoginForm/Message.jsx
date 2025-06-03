import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import './Message.css';
import tutors from './tutors_listOutput.json' with { type: 'json' };
import { useGetCourses, useUpdateCourses } from './useCourseManagement.js';
import axios from "axios";

async function getClassMembers (course) {
    const response = await axios.post('http://localhost:5000/get-course-members', {
        "token": localStorage.getItem("session"),
        "course": course
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

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderRole, setSenderRole] = useState('Student');
  const [targetList, setTargetList] = useState([]);
  const [yourCourses, setYourCourses] = useState([]);
  const [sendTarget, setSendTarget] = useState("");
  useGetCourses(setYourCourses);


  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
    setMessages(storedMessages);

    // Load current user email from localStorage
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser && storedUser.email) {
      setSenderName(storedUser.email.split('@')[0]); // Use email prefix as name
    }
    let validTargets = [];
    let idnum = 0;      //use a idnum in outer scope in case someone can tutor multiple classes
    for(let i = 0; i < tutors.tutorData.length; i++)
    {
        if(tutors.tutorData[i].tutorName === storedUser.email)
        {
            setSenderRole("Tutor");
            // populate our valid targets with the students of the class we are tutoring
            (async () => {
                try {
                    const classes = await getClassMembers(tutors.tutorData[i].className);
                    for(let j = 0; j < classes.length; j++)
                    {
                        validTargets.push({
                            id: idnum,
                            email: classes[j],
                            className: tutors.tutorData[i].className
                        });
                        idnum++;
                    }
                } catch (error) {
                    console.error("Error fetching tutored students:", error);
                }
            })();
        }
    }
    //Populate our valid targets with the tutors of every class we are in
    if(senderRole === "Student")
    {
        for(let i = 0; i < tutors.tutorData.length; i++)
        {
            if(yourCourses.includes(tutors.tutorData[i].className))
            {
                validTargets.push({
                    id: i,
                    email: tutors.tutorData[i].tutorName,
                    className: tutors.tutorData[i].className
                });
            }
        }
    }
    setTargetList(validTargets);
  }, []);

  console.log(targetList)

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
          <label>Messaging:</label>
          <select value={senderRole} onChange={(e) => setSendTarget(e.target.value)}>
            {targetList.map((target)=>(
                <option key={target.id} value={target.email}>
                    {target.email} in class: {target.className}
                </option>
                ))}
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
