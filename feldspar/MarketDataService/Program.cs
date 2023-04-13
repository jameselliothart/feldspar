using System;
using MarketDataService.Providers;
using StackExchange.Redis;

var redisConnectionString = Environment.GetEnvironmentVariable("REDIS_CONNECTION") ??
    throw new ArgumentNullException("REDIS_CONNECTION", "Please provide define environment variable for REDIS_CONNECTION");
var alphaVantageBaseUri = Environment.GetEnvironmentVariable("ALPHAVANTAGE_BASE") ??
    throw new ArgumentNullException("ALPHAVANTAGE_BASE", "Please provide define environment variable for ALPHAVANTAGE_BASE");
var alphaVantageApiKey = Environment.GetEnvironmentVariable("ALPHAVANTAGE_API_KEY") ??
    throw new ArgumentNullException("ALPHAVANTAGE_API_KEY", "Please provide define environment variable for ALPHAVANTAGE_API_KEY");

var redis = ConnectionMultiplexer.Connect(redisConnectionString);
var sub = redis.GetSubscriber();

var alphaVantage = new AlphaVantage(alphaVantageBaseUri, alphaVantageApiKey);

sub.Subscribe("MarketData.Request", async (ch, msg) => {
    Console.WriteLine($"Received request for [{msg.ToString()}]");
    var request = msg.ToString().Split('|');
    var (commodity, interval) = (request[0], request[1]);
    var data = await alphaVantage.GetCommodityData(commodity, interval);
    sub.Publish("MarketData.Provider", data);
});
sub.Subscribe("MarketData.Provider", (ch, msg) => {
    Console.WriteLine("Received market data:");
    System.Console.WriteLine(msg.ToString());
});

sub.Publish("MarketData.Request", "WHEAT|MONTHLY");

Console.ReadKey();