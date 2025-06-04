import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import './Message.css';
import tutors from './tutors_listOutput.json' with { type: 'json' };
import { useGetCourses, useUpdateCourses } from './useCourseManagement.js';
import axios from "axios";

/*
This function returns the display name and email associated with a user id
*/
async function getEmailAndDname (userid) {
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

async function getIdFromEmail (email) {
    const response = await axios.post('http://localhost:5000//get-id-from-selected-email', {
        "token": localStorage.getItem("session"),
        "email": email
    }).catch(function (e) {
        console.log(e);
        return false;
    })
    if (response.status === 200) {
        if (response.data)
            console.log(response.data);
            return response.data;
    }

    return false;
}

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

async function getDirectMessages (user1, user2) {
    const response = await axios.post('http://localhost:5000/get-direct-messages', {
        "token": localStorage.getItem("session"),
        "user1": user1,
        "user2": user2
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

async function sendDirectMessage (send, receive, text) {
    const response = await axios.post('http://localhost:5000/send-direct-message', {
        "token": localStorage.getItem("session"),
        "send": send,
        "receive": receive,
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

const Message = () => {
  const [messages, setMessages] = useState([]);             // the messages we are displaying
  const [newMessage, setNewMessage] = useState('');         // the message we have entered
  const [senderEmail, setSenderEmail] = useState('');       // our email address
  const [senderId, setSenderId] = useState(0);              // our user id
  const [senderRole, setSenderRole] = useState('Student');  // our role: Tutor or Student
  const [targetList, setTargetList] = useState([]);     // the list of people we are allowed to message
  const [yourCourses, setYourCourses] = useState([]);   // our courses
  const [sendTarget, setSendTarget] = useState("");     // email of who we are messaging
  const [sendTargetId, setSendTargetId] = useState(0);  // id of who we are messaging
  useGetCourses(setYourCourses);

  useEffect(() => {

    // Load current user email from localStorage
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser && storedUser.email) {
      setSenderEmail(storedUser.email); // Use email
    }

    // Get the user's id number from the email
    (async () => {
        try {
            const id = await getIdFromEmail(storedUser.email);
            setSenderId(id);

            let validTargets = [{
                                id: 0,
                                email: "",
                                className: "",
                                displayText: "Select someone to message"
                                }];
            let idnum = 1;      //use a idnum in outer scope in case someone can tutor multiple classes
            for(let i = 0; i < tutors.tutorData.length; i++)
            {
                if(tutors.tutorData[i].tutorName === storedUser.email)
                {
                    setSenderRole("Tutor");
                    // populate our valid targets with the students of the class we are tutoring and refresh message display
                        const classes = await getClassMembers(tutors.tutorData[i].className);
                        for(let j = 0; j < classes.length; j++)
                        {
                            validTargets.push({
                                id: idnum,
                                email: classes[j],
                                className: tutors.tutorData[i].className
                            });
                            validTargets[j+1].displayText =classes[j]+" in class: "+tutors.tutorData[i].className;
                            idnum++;
                        }
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
                        validTargets[i+1].displayText =tutors.tutorData[i].tutorName+" in class: "+tutors.tutorData[i].className;
                    }
                }
            }
            setTargetList(validTargets);
            setSendTarget("");
        } catch (error) {
            console.error("Error loading page:", error);
        }
    })();
  }, []);

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
            console.error("Error fetching tutored students:", error);
        }
    })();
    }, 5000);

    return () => {
        clearInterval(intervalId)
        };
  }, [sendTarget, senderId, sendTargetId]);     // depends on these values as they are used in refreshMessages()

   const refreshMessages = async () => {
      if(sendTarget === "")     // don't load messages if no sender selected
      {
          setMessages([]);
          return;
      }

      const allMessages = await getDirectMessages(senderId, sendTargetId);
      let messages = [];
      let sendEmail = "";       // email of the message sender
      let targetEmail = "";     // email of the message recipient
      console.log(allMessages);
      //format the messages in json that can be displayed
      for(let i = 0; i < allMessages.length; i++)
      {
            //get the emails of senders and receivers
            if(senderId == allMessages[i][0])  // this case we sent the message
            {
                sendEmail = senderEmail;
                targetEmail = sendTarget;
            }
            else if(senderId == allMessages[i][1])        // this case we received the message
            {
                sendEmail = sendTarget;
                targetEmail = senderEmail;
            }

            const newMsg = {
              text: allMessages[i][3],
              sender: sendEmail || 'Anonymous',
              role: senderRole,
              target: targetEmail,
              timestamp: allMessages[i][2],
            };
            messages.push(newMsg);
      }
      console.log(messages);
      setMessages(messages);
  }

  const changeSendTarget = async (e) => {
    e.preventDefault();
    setSendTarget(e.target.value);
    if(e.target.value === "") return;       // return if no recipient is selected

    // get id from email
    const id = await getIdFromEmail(e.target.value);
    console.log(id);
    setSendTargetId(id);
  };

  useEffect(() => {
    (async () => {
        try {
            // refresh to show messages with recipient
            await refreshMessages();
            console.log(sendTarget);
        } catch (error) {
            console.error("Error fetching tutored students:", error);
        }
    })();
  }, [sendTarget, sendTargetId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || sendTarget === "") return;

    // send the message
    sendDirectMessage(senderId, sendTargetId, newMessage);
    setNewMessage('');

    // refresh the messages
    await refreshMessages();
  };

  return (
    <Layout>
      <div className="message-container">
        <h1>Message Tutor/Student!</h1>

        <form onSubmit={handleSendMessage} className="message-form">
          <label>Messaging:</label>
          <select onChange={(e) => changeSendTarget(e)}>
            {targetList.map((target)=>(
                <option key={target.id} value={target.email}>
                    {target.displayText}
                </option>
                ))}
          </select>

          <textarea
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={refreshMessages}>Refresh</button>
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
