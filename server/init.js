import http from 'http';
import socket_io from 'socket.io';

const PORT = 8080;

Meteor.startup(function() {

    // Mail URL
    process.env.MAIL_URL = Meteor.settings.MAIL_URL;

    // Start cron jobs
    SyncedCron.start();

    // Create users
    Meteor.call('createUsers');

    // Server
    const server = http.createServer();
    const io = socket_io(server);

    let counter = 0;

    // New client
    io.on('connection', function(socket) {
        console.log('new socket client');
    });

    // Start server
    try {
        server.listen(PORT);
        console.log('Socket.io started')
    } catch (e) {
        console.error(e);
    }

});
