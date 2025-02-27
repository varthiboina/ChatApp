const { Server } = require('socket.io');
const { join } = require('node:path');

exports.websocket = (app, server) => {
    const io = new Server(server, { connectionStateRecovery: {} });

 

    io.on('connection', (socket) => {
        console.log(`User ${socket.id} connected`);

        socket.on('rejoin',(room) =>
        {
            const chatRoomId = room > socket.id ? room + socket.id : socket.id + room;
            socket.join(chatRoomId);
            socket.roomId = chatRoomId;
            console.log(`User ${socket.id} joined room: ${chatRoomId}`);
            socket.emit('message', { room:room, rejoin:true });

        })

        socket.on('join room', (room) => {
            const chatRoomId = room > socket.id ? room + socket.id : socket.id + room;
            socket.join(chatRoomId);
            socket.roomId = chatRoomId;
            console.log(`User ${socket.id} joined room: ${chatRoomId}`);
            socket.emit('message', { room:room, rejoin:false });
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
};
