// In your Express server.js file
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // change to your user
    password: 'Passed_Word',
    database: 'coen174' // ensure this matches your schema
});

db.connect((err) => {
    if (err) {
        console.error('MySQL connection failed:', err);
    } else {
        console.log('✅ MySQL connected successfully');
    }
});

// Get messages for a course
app.get('/api/messages/:courseId', (req, res) => {
    const courseId = req.params.courseId;
    db.query(
        'SELECT user_id, text FROM forum_message WHERE class_name = ? ORDER BY timestamp ASC',
        [courseId],
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            // Always return a valid JSON array
            return res.json(results || []);
        }
    );
});

// Post a new message
app.post('/api/messages', (req, res) => {
    const text = req.body.text;
    const sender = req.body.user_id;
    const courseId = req.body.class_name; // Assuming user_id is passed in the request body
    const timestamp = new Date();
    const query = 'INSERT INTO forum_message (user_id, class_name, timestamp, text) VALUES (?, ?, ?, ?)';

    db.query(query, [sender, courseId, timestamp, text], (err, result) => {
        if (err) return res.status(500).send(err);

        const newMessage = {
            user_id: sender,
            class_name: courseId,
            timestamp: timestamp,
            text: text
        };

        io.to(courseId).emit('newMessage', newMessage);
        res.status(200).json(newMessage);
    });
});

// Socket.IO chat room logic
io.on('connection', socket => {
    console.log('User connected');

    socket.on('joinRoom', room => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
});

    socket.on('newMessage', (message) => {
        io.to(message.courseId).emit('newMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(5001, () => {
    console.log('Server running on http://localhost:5001');
});
