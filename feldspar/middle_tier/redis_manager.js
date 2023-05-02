const logger = require('log4js').getLogger();
logger.level = 'info';

class RedisSubscriber {
    constructor(redisSub) {
        this.redisSub = redisSub;
        this.socket = undefined;
    }

    setSocket(socket) {
        logger.info(`Setting redis subscriber socket ${socket.id}`);
        this.socket = socket;
    }

    async subscribe(channel = 'MarketData.Publish.*') {
        logger.info(`Subscribing to ${channel}`);
        await this.redisSub.pSubscribe(channel, (rawData, ch) => {
            const [_0, _1, requestKey] = ch.split('.');
            logger.info(`Received response from ${ch}`);
            const assetData = JSON.parse(rawData);
            // TODO move filtering to marketdataservice - avoid caching bad values
            assetData.data = assetData.data.filter(dataPoint => !Number.isNaN(parseFloat(dataPoint.value)));
            assetData.data.sort((a, b) => (new Date(a.date)) - (new Date(b.date)));
            logger.info(`Emitting data to FromServer.Command.UpdateAssetData over socket ${this.socket.id}`);
            this.socket.emit(`FromServer.Command.UpdateAssetData`, {requestKey, assetData})
        });
    }
}

module.exports = RedisSubscriber;
