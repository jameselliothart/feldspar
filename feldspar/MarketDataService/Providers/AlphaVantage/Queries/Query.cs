namespace MarketDataService.Providers.AlphaVantage.Queries;
using System.Collections.Immutable;

public interface IAssetQuery { }

public record CommodityQuery(string Name, string Interval) : IAssetQuery;

public interface IAsset
{
    IAssetQuery ToQuery(IEnumerable<string> args);
}

public record Commodity(string Name) : IAsset
{
    public readonly ImmutableList<string> ValidIntervals =
        ImmutableList<string>.Empty.AddRange(new List<string> { "DAILY", "WEEKLY", "MONTHLY" });

    public IAssetQuery ToQuery(IEnumerable<string> args)
    {
        var interval = args.Skip(1).Take(1).Single().ToUpper();
        if (ValidIntervals.Contains(interval))
        {
            return new CommodityQuery(Name, interval);
        }
        else
        {
            var msg = $"Provided interval '{interval}' is not one of the accepted: {string.Join(',', ValidIntervals)}";
            throw new ArgumentOutOfRangeException(nameof(interval), msg);
        }
    }
}

public record QueryArgs(IList<string> Values)
{
    public static QueryArgs FromMessage(string message)
    {
        return new QueryArgs(message.Split('|'));
    }
}

public static class Parser
{

    private static IAsset ParseAsset(string asset)
    {
        switch (asset)
        {
            case "WTI":
            case "BRENT":
            case "NATURAL_GAS":
            case "COPPER":
            case "ALUMINUM":
            case "WHEAT":
            case "CORN":
            case "COTTON":
            case "SUGAR":
            case "COFFEE":
            case "ALL_COMMODITIES":
                return new Commodity(asset);
            default:
                throw new ArgumentOutOfRangeException(nameof(asset), $"Unrecognized asset '{asset}'!");
        }
    }

    public static IAssetQuery? GetAssetQuery(string message)
    {
        try
        {
            var queryArgs = QueryArgs.FromMessage(message);
            var assetName = queryArgs.Values.First();
            var asset = ParseAsset(assetName);
            var assetQuery = asset.ToQuery(queryArgs.Values);
            return assetQuery;
        }
        catch (System.Exception ex)
        {
            System.Console.WriteLine($"Cannot parse query message: '{message}'! {ex}");
            return null;
        }
    }
}
