using MarketDataService.Config;
using MarketDataService.Providers;
using StackExchange.Redis;

var config = Configuration.FromEnvironmentVariables();

var redis = ConnectionMultiplexer.Connect(config.RedisConnectionString);
var sub = redis.GetSubscriber();
var db = redis.GetDatabase();

var alphaVantage = new AlphaVantage(config.AlphaVantageBaseUri, config.AlphaVantageApiKey);

sub.Subscribe("MarketData.Query", async (ch, msg) => {
    var requestKey = msg.ToString();
    Console.WriteLine($"Received request for [{requestKey}] on channel [{ch.ToString()}]");
    var cacheResult = await db.StringGetAsync(requestKey);
    var result = cacheResult;
    if (cacheResult.IsNullOrEmpty)
    {
        System.Console.WriteLine($"Cache miss for [{requestKey}]. Querying API.");
        var requestItems = requestKey.Split('|');
        var (commodity, interval) = (requestItems[0], requestItems[1]);
        result = await alphaVantage.GetCommodityData(commodity, interval);
        await db.StringSetAsync(requestKey, result, new TimeSpan(hours: 0, minutes: 5, seconds: 0), When.NotExists);
    }
    else {System.Console.WriteLine($"Cache hit for [{requestKey}].");}
    sub.Publish("MarketData.Publish", result);
});

System.Console.WriteLine("MarketDataService has started.");

while (true)
{
    continue;
}