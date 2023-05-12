package com.feldspar.MarketDataService;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class AlphaVantage {

    private final URI baseUri;

    public AlphaVantage(String baseUri, String apiKey) throws URISyntaxException {

        this.baseUri = new URI(String.format("%s/query?apikey=%s", baseUri, apiKey));
    }

    private URI CommodityQuery(String commodity, String interval) throws URISyntaxException
    {
        var uriString = String.format("%s&function=%s&interval=%s", baseUri, commodity, interval);
        return new URI(uriString);
    }

    public String GetCommodityData(String name, String interval) throws IOException, InterruptedException, URISyntaxException
    {
        var queryUri = CommodityQuery(name, interval);
        var client = HttpClient.newHttpClient();
        var request = HttpRequest.newBuilder(queryUri).build();
        var response = client.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }
}
