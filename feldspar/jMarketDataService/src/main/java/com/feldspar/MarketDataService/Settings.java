package com.feldspar.MarketDataService;

public record Settings(String redisConnection, String alphaVantageUri, String alphaVantageApiKey) {}