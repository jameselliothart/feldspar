using MarketDataService.Config;
using MarketDataService.Providers.AlphaVantage;
using MarketDataService.Providers.AlphaVantage.Queries;
using StackExchange.Redis;

var config = Configuration.FromEnvironmentVariables();

var redis = ConnectionMultiplexer.Connect(config.RedisConnectionString);
var pubsub = redis.GetSubscriber();
var db = redis.GetDatabase();

var alphaVantage = new AlphaVantage(config.AlphaVantageBaseUri, config.AlphaVantageApiKey);

// surprisingly hard to find documentation on * for wildcard
pubsub.Subscribe("MarketData.Query.*", async (ch, msg) => {
    var requestKey = msg.ToString();
    Console.WriteLine($"Received request for [{requestKey}] on channel [{ch.ToString()}]");
    var assetQuery = Parser.GetAssetQuery(requestKey);
    if (assetQuery == null)
    {
        var warning = $"Unable to create query for '{requestKey}'! " +
            "Parser may need to be updated to handle this. No market data will be returned.";
        System.Console.WriteLine(warning);
        return;
    }
    var cacheResult = await db.StringGetAsync(requestKey);
    var result = cacheResult.ToString();
    if (cacheResult.IsNullOrEmpty)
    {
        System.Console.WriteLine($"Cache miss for [{requestKey}]. Querying API.");
        result = await alphaVantage.Query(assetQuery);
        await db.StringSetAsync(requestKey, result, new TimeSpan(hours: 0, minutes: 5, seconds: 0), When.NotExists);
    }
    else
    {
        System.Console.WriteLine($"Cache hit for [{requestKey}].");
    }
    System.Console.WriteLine($"Received result of length {result.Length} for [{requestKey}]");
    var publishChannel = $"MarketData.Publish.{requestKey}";
    System.Console.WriteLine($"Publishing result to {publishChannel}");
    pubsub.Publish(publishChannel, result);
});

System.Console.WriteLine("MarketDataService has started.");

while (true)
{
    continue;
}