const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const index = require("./routes/index");
const redis = require("redis");
const RedisSubscriber = require("./redis_manager");
const logger = require('log4js').getLogger();
logger.level = 'info';

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
let subClient;

(async () => {
    const url = `redis://${REDIS_CONN}`;
    logger.info('Connecting to redis host', url)
    redisSub = redis.createClient({ url });
    redisSub.on('error', err => logger.info('Redis subscriber error', err));
    redisPub = redisSub.duplicate();
    redisPub.on('error', err => logger.info('Redis publisher error', err));
    await redisSub.connect();
    await redisPub.connect();
    subClient = new RedisSubscriber(redisSub);
    await subClient.subscribe();
})();


io.on("connection", (socket) => {
    logger.info("New client connected: ", socket.id);

    socket.on("disconnect", (reason) => {
        logger.info("Client disconnected", socket.id, 'Reason', reason);
    });

    subClient.setSocket(socket);

    socket.on('FromClient.Query', async (requestKey) => {
        logger.info('FromClient.Query:', requestKey, 'received');
        logger.info('Submitting query to', `MarketData.Query.${requestKey}`, 'for', requestKey);
        await redisPub.publish(`MarketData.Query.${requestKey}`, requestKey)
    });
});

server.listen(PORT, err => {
    if (err) logger.info(err);
    logger.info(`Listening on port ${PORT}`);
});
