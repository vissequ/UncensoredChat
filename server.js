const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

// Generate random username
function generateRandomName() {
    const adjectives = ['Mystic', 'Silent', 'Shadow', 'Quick', 'Hidden'];
    const nouns = ['Whisper', 'Echo', 'Ghost', 'Stranger', 'Voice'];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 1000);
    return `${randomAdj}${randomNoun}${number}`;
}

io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Handle username
    socket.on('join', (username) => {
        socket.username = username || generateRandomName();
        io.emit('user joined', `${socket.username} has joined the chat`);
    });

    // Handle chat messages
    socket.on('chat message', (msg) => {
        io.emit('chat message', {
            username: socket.username,
            message: msg,
            timestamp: new Date().toISOString()
        });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        if (socket.username) {
            io.emit('user left', `${socket.username} has left the chat`);
        }
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});