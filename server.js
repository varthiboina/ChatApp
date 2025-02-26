const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, { connectionStateRecovery: {} });
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});
io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`);

    socket.on('join room', (room) => {
        socket.join(room);
        socket.roomId = room; 
        console.log(`User ${socket.id} joined room: ${room}`);
        socket.emit('message', {room:room , chatRoomId : chatRoomId});
    });
    socket.on('chat message', (msg) => {
        if (socket.roomId) {
            console.log(`Message from ${socket.id} in room ${socket.roomId}: ${msg.text}`);
            io.to(socket.roomId).emit('message', { id: socket.id, text: msg.text }); 
        } else {
            console.log('User is not in any room.');
        }
    });
    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
    });
});

server.listen(9000, () => {
    console.log('Server running at http://localhost:9000');
});