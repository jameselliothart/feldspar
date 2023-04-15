using MarketDataService.Providers;
using StackExchange.Redis;
// TODO: docker compose env vars
var redisConnectionString = Environment.GetEnvironmentVariable("REDIS_CONNECTION") ??
    throw new ArgumentNullException("REDIS_CONNECTION", "Please provide define environment variable for REDIS_CONNECTION");
var alphaVantageBaseUri = Environment.GetEnvironmentVariable("ALPHAVANTAGE_BASE_URI") ??
    throw new ArgumentNullException("ALPHAVANTAGE_BASE_URI", "Please provide define environment variable for ALPHAVANTAGE_BASE_URI");
var alphaVantageApiKey = Environment.GetEnvironmentVariable("ALPHAVANTAGE_API_KEY") ??
    throw new ArgumentNullException("ALPHAVANTAGE_API_KEY", "Please provide define environment variable for ALPHAVANTAGE_API_KEY");

var redis = ConnectionMultiplexer.Connect(redisConnectionString);
var sub = redis.GetSubscriber();

var alphaVantage = new AlphaVantage(alphaVantageBaseUri, alphaVantageApiKey);

sub.Subscribe("MarketData.Query", async (ch, msg) => {
    Console.WriteLine($"Received request for [{msg.ToString()}]");
    var request = msg.ToString().Split('|');
    var (commodity, interval) = (request[0], request[1]);
    var data = await alphaVantage.GetCommodityData(commodity, interval);
    sub.Publish("MarketData.Publish", data);
});

System.Console.WriteLine("Listening... Press any key to exit.");
Console.ReadKey();