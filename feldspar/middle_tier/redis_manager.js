class RedisSubscriber {
    constructor(redisSub) {
        this.redisSub = redisSub;
        this.socket = undefined;
    }

    setSocket(socket) { this.socket = socket }

    async subscribe() {
        await this.redisSub.pSubscribe(`MarketData.Publish.*`, (rawData, ch) => {
            console.log('Received response from', ch);
            const [_0, _1, requestKey] = ch.split('.');
            const assetData = JSON.parse(rawData);
            // TODO move filtering to marketdataservice - avoid caching bad values
            assetData.data = assetData.data.filter(dataPoint => !Number.isNaN(parseFloat(dataPoint.value)));
            assetData.data.sort((a, b) => (new Date(a.date)) - (new Date(b.date)));
            console.log('Emitting data to', `FromServer.Command.${requestKey}`);
            this.socket.emit(`FromServer.Command.*`, assetData)
        });
    }
}

module.exports = RedisSubscriber;
