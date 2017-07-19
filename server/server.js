// import http from 'http';
// import socket_io from 'socket.io';

// const PORT = 8080;

// // Mail URL
// process.env.MAIL_URL = Meteor.settings.MAIL_URL;

// // Start cron jobs
// SyncedCron.start();

// // Create users
// Meteor.call('createUsers');

// // Server
// const server = http.createServer();
// const io = socket_io(server);

// let counter = 0;

// // New client
// io.on('connection', Meteor.bindEnvironment(function(socket) {

//     console.log('new socket client');

//     // console.log(socket);

//     connection = {
//         socketId: socket.id,
//         referer: socket.handshake.headers.referer,
//         time: new Date(socket.handshake.time)
//     }

//     Meteor.call('handleNewConnection', connection);

//     socket.on('disconnect', Meteor.bindEnvironment(function() {
//         Meteor.call('handleDisconnection', connection);
//     }));

// }));

// // Start server
// try {
//     server.listen(PORT);
//     console.log('Socket.io started')
// } catch (e) {
//     console.error(e);
// }

// Meteor.methods({

//     sendMessageConnection: function(connectionId) {

//         var connection = Connections.findOne(connectionId);
//         io.to(connection.socketId).emit('message', 'Hello!');

//     }

// });
