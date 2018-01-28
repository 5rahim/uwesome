"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var debug = require("debug");
var Server_1 = require("./Server");
var Socketio_1 = require("./app/Socketio");
var Friendship_1 = require("./core/Friendship");
debug('ts-express:server');
var port = normalizePort(process.env.PORT || 4003);
Server_1.default.set('port', port);
console.log("Server listening on port " + port);
var server = http.createServer(Server_1.default);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
function normalizePort(val) {
    var port = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port))
        return val;
    else if (port >= 0)
        return port;
    else
        return false;
}
function onError(error) {
    if (error.syscall !== 'listen')
        throw error;
    var bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onListening() {
    var addr = server.address();
    var bind = (typeof addr === 'string') ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);
}
var io = require('socket.io').listen(server);
Socketio_1.default.initialize(io);
Friendship_1.default.initialize(io);
