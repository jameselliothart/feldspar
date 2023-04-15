const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const index = require("./routes/index");
const redis = require("redis");

const PORT = process.env.MT_PORT || 80;

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});

let redisSub;
let redisPub;

(async () => {
    redisSub = redis.createClient();
    redisSub.on('error', err => console.log('Redis subscriber error', err));
    redisPub = redisSub.duplicate();
    redisPub.on('error', err => console.log('Redis publisher error', err));
    await redisSub.connect();
    await redisPub.connect();
})();


io.on("connection", (socket) => {
    console.log("New client connected: ", socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });

    socket.on('FromClient.Query', async (msg) => {
        console.log('FromClient.Query:', msg);
        await redisSub.subscribe('MarketData.Publish', (data, ch) => {
            console.log(data)
            socket.emit('FromServer.Command', data)
        });
        await redisPub.publish('MarketData.Query', msg)
    });
});

server.listen(PORT, err => {
    if(err) console.log(err);
    console.log(`Listening on port ${PORT}`);
});
