const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const index = require("./routes/index");
const redis = require("redis");

const REDIS_HOST = process.env.FELDSPAR_REDIS_HOST || 'localhost'

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
    const url = `redis://${REDIS_HOST}`;
    console.log('Connecting to redis host', url)
    redisSub = redis.createClient({ url });
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
