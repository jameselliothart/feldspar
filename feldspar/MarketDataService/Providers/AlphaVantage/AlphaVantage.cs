using MarketDataService.Providers.AlphaVantage.Queries;

namespace MarketDataService.Providers.AlphaVantage;

public class AlphaVantage
{
    private readonly Uri _baseUri;

    public AlphaVantage(string baseUri, string apiKey)
    {
        if (baseUri == null) throw new ArgumentNullException(nameof(baseUri));
        if (string.IsNullOrEmpty(apiKey))
        {
            throw new ArgumentException($"'{nameof(apiKey)}' cannot be null or empty.", nameof(apiKey));
        }

        _baseUri = new Uri($"{baseUri}/query?apikey={apiKey}");
    }

    public async Task<string> Query(IAssetQuery assetQuery) => assetQuery switch
    {
        CommodityQuery(var name, var interval) => await GetCommodityData(name, interval),
        _ => throw new ArgumentOutOfRangeException(nameof(assetQuery), $"Unrecognized asset query {assetQuery}!"),
    };

    private Uri CommodityQuery(string commodity, string interval)
    {
        var uriString = $"{_baseUri}&function={commodity}&interval={interval}";
        return new Uri(uriString);
    }

    public async Task<string> GetCommodityData(string name, string interval)
    {
        var queryUri = CommodityQuery(name, interval);
        using var client = new HttpClient();
        var response = await client.GetAsync(queryUri);
        response.EnsureSuccessStatusCode();
        var responseString = await response.Content.ReadAsStringAsync();
        return responseString;
    }
}
