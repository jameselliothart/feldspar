namespace MarketDataService.Providers;

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

    private Uri CommodityQuery(string commodity, string interval)
    {
        var uriString = $"{_baseUri}&function={commodity}&interval={interval}";
        return new Uri(uriString);
    }

    public async Task<string> GetCommodityData(string commodity, string interval)
    {
        var queryUri = CommodityQuery(commodity, interval);
        using var client = new HttpClient();
        var response = await client.GetAsync(queryUri);
        response.EnsureSuccessStatusCode();
        var responseString = await response.Content.ReadAsStringAsync();
        return responseString;
    }
}
