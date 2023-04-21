using MarketDataService.Config;
using MarketDataService.Providers;
using StackExchange.Redis;

var config = Configuration.FromEnvironmentVariables();

var redis = ConnectionMultiplexer.Connect(config.RedisConnectionString);
var sub = redis.GetSubscriber();

var alphaVantage = new AlphaVantage(config.AlphaVantageBaseUri, config.AlphaVantageApiKey);

sub.Subscribe("MarketData.Query", async (ch, msg) => {
    Console.WriteLine($"Received request for [{msg.ToString()}]");
    var request = msg.ToString().Split('|');
    var (commodity, interval) = (request[0], request[1]);
    var data = await alphaVantage.GetCommodityData(commodity, interval);
    sub.Publish("MarketData.Publish", data);
});

System.Console.WriteLine("MarketDataService has started.");

while (true)
{
    continue;
}