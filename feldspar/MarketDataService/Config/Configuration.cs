namespace MarketDataService.Config;

public class Configuration
{
    const string FELDSPAR_REDIS_CONNECTION = "FELDSPAR_REDIS_CONNECTION";
    const string FELDSPAR_ALPHAVANTAGE_API_KEY = "FELDSPAR_ALPHAVANTAGE_API_KEY";
    const string FELDSPAR_ALPHAVANTAGE_BASE_URI = "FELDSPAR_ALPHAVANTAGE_BASE_URI";
    const string DEFAULT_ALPHAVANTAGE_BASE_URI = "https://www.alphavantage.co";

    public string RedisConnectionString { get; }
    public string AlphaVantageApiKey { get; }
    public string AlphaVantageBaseUri { get; }

    public Configuration(
        string redisConnectionString,
        string alphaVantageApiKey,
        string alphaVantageBaseUri
        )
    {
        if (string.IsNullOrEmpty(redisConnectionString))
        {
            throw new ArgumentException($"'{nameof(redisConnectionString)}' cannot be null or empty.", nameof(redisConnectionString));
        }
        if (string.IsNullOrEmpty(alphaVantageApiKey))
        {
            throw new ArgumentException($"'{nameof(alphaVantageApiKey)}' cannot be null or empty.", nameof(alphaVantageApiKey));
        }
        RedisConnectionString = redisConnectionString;
        AlphaVantageApiKey = alphaVantageApiKey;
        AlphaVantageBaseUri = alphaVantageBaseUri;
    }

    public static Configuration FromEnvironmentVariables()
    {
        var redisConn = Environment.GetEnvironmentVariable(FELDSPAR_REDIS_CONNECTION);
        if (string.IsNullOrEmpty(redisConn))
            throw new ArgumentNullException($"Please provide env var {FELDSPAR_REDIS_CONNECTION}");
        var apiKey = Environment.GetEnvironmentVariable(FELDSPAR_ALPHAVANTAGE_API_KEY);
        if (string.IsNullOrEmpty(apiKey))
            throw new ArgumentNullException($"Please provide env var {FELDSPAR_ALPHAVANTAGE_API_KEY}");
        var baseUri = Environment.GetEnvironmentVariable(FELDSPAR_ALPHAVANTAGE_BASE_URI);
        if (string.IsNullOrEmpty(baseUri))
            baseUri = DEFAULT_ALPHAVANTAGE_BASE_URI;

        return new Configuration(redisConn, apiKey, baseUri);
    }
}