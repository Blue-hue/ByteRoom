const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = new Server(server);



const userSocketMap = {};

const getAllConnectedClients = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => ({
            socketId,
            username: userSocketMap[socketId] || 'Unknown User',
        })
    );
}

io.on('connection', (socket) => {


    // Handle user disconnection
    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit('user-disconnected', {
                socketId: socket.id,
                username: userSocketMap[socket.id] || 'Unknown User',
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
        console.log('User disconnected');
    });

    // Handle joining a room
    socket.on('join', ({ roomId, username }) => {

        //keep track of the user and their socket
        userSocketMap[socket.id] = username;

        // Join the room
        socket.join(roomId);

        //notify current users in the room
        const clients = getAllConnectedClients(roomId);

        console.log("clients", clients);

        clients.forEach(
            ({socketId}) => {
                io.to(socketId).emit('user-joined', {
                    clients,
                    username,
                    socketId: socket.id,
                });
            }
        )
    });

    // Handle code changes
    socket.on('code-changed', ({ roomId, code }) => {
        socket.in(roomId).emit('code-changed', {
            code,
            username: userSocketMap[socket.id] || 'Unknown User',   
        });
    });

    socket.on('sync-code', ({ socketId, code }) => {
        io.to(socketId).emit('sync-code', {
            code
        });
    });



});



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});