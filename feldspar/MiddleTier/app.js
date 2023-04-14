const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const index = require("./routes/index");

const PORT = process.env.MT_PORT || 4001;

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});

let interval;

io.on("connection", (socket) => {
    console.log("New client connected: ", socket.id);
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 1000);
    socket.on("disconnect", () => {
        console.log("Client disconnected");
        clearInterval(interval);
    });
});

const getApiAndEmit = socket => {
    const response = new Date();
    // Emitting a new message. Will be consumed by the client
    socket.emit("FromAPI", response);
};

server.listen(PORT, err => {
    if(err) console.log(err);
    console.log(`Listening on port ${PORT}`);
});
