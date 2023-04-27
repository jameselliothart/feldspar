const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const index = require("./routes/index");
const redis = require("redis");

const PORT = process.env.FELDSPAR_MT_PORT || 4001;
const REDIS_CONN = process.env.FELDSPAR_REDIS_CONNECTION || 'localhost'

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
    const url = `redis://${REDIS_CONN}`;
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

    socket.on('FromClient.Query', async (requestKey) => {
        console.log('FromClient.Query:', requestKey, 'received');
        await redisSub.subscribe(`MarketData.Publish.${requestKey}`, (data, ch) => {
            console.log('Received response from', ch);
            console.log('Emitting command of length', data.length, 'to', `FromServer.Command.${requestKey}`);
            socket.emit(`FromServer.Command.${requestKey}`, data)
        });
        console.log('Submitting query to', `MarketData.Query.${requestKey}`, 'for', requestKey);
        await redisPub.publish(`MarketData.Query.${requestKey}`, requestKey)
    });
});

server.listen(PORT, err => {
    if(err) console.log(err);
    console.log(`Listening on port ${PORT}`);
});
