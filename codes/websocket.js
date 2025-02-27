const { Server } = require('socket.io');
const Message = require('../Entity/Message')
const { join } = require('node:path');
const {createChat , addToChat} = require('../Entity/services/ChatService')

exports.websocket = (app, server) => {
    const io = new Server(server, { connectionStateRecovery: {} });
    io.on('connection', (socket) => {
        console.log(`User ${socket.id} connected`);
        socket.on('rejoin',(room) =>
        {
            const chatRoomId = room > socket.id ? room + socket.id : socket.id + room;
            socket.join(chatRoomId);
            socket.room = room;
            socket.roomId = chatRoomId;
            console.log(`User ${socket.id} joined room: ${chatRoomId}`);
            socket.emit('message', { room:room, rejoin:true });
        });
        socket.on('join room', (room) => {
            const chatRoomId = room > socket.id ? room + socket.id : socket.id + room;
            socket.join(chatRoomId);
            createChat(chatRoomId);
            socket.roomId = chatRoomId;
            console.log(`User ${socket.id} joined room: ${chatRoomId}`);
            socket.emit('message', { room:room, rejoin:false });
        });
        socket.on('chat message', (msg) => {
            if (socket.roomId) {
                const chatMessage = new Message({text : msg.text , received : false , seen : false , timestamp : Date.now()})
                addToChat(socket.roomId,chatMessage,socket.room , socket.id)
                //console.log(`Message from ${socket.id} in room ${socket.roomId}: ${msg.text}`);
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
