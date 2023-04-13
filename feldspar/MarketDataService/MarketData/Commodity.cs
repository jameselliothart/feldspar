namespace MarketDataService.MarketData;

public record DataPoint(DateTime date, int value);
public record Commodity(string name, string interval, string unit, IEnumerable<DataPoint> data);