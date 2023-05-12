package com.feldspar.MarketDataService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;


@Configuration
@PropertySource("classpath:application.properties")
@ComponentScan
public class MarketDataServiceConfig {
    @Value("${redis.connection}")
    private String redisConnection;
    @Value("${alphavantage.uri}")
    private String alphaVantageUri;
    @Value("${alphavantage.apiKey}")
    private String alphaVantageApiKey;

    @Bean
    public Settings settings() {
        return new Settings(redisConnection, alphaVantageUri, alphaVantageApiKey);
    }

    @Bean
    public static PropertySourcesPlaceholderConfigurer placeholderConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }

}
