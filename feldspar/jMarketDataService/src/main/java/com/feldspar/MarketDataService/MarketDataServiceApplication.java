package com.feldspar.MarketDataService;

import java.io.IOException;
import java.net.URISyntaxException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPubSub;

@SpringBootApplication
public class MarketDataServiceApplication {
	private static final Logger _logger = LoggerFactory.getLogger(MarketDataServiceApplication.class);

	public static void main(String[] args) {
		final Jedis jedisSub = new Jedis();
		final Jedis jedisPub = new Jedis();

		try (ConfigurableApplicationContext context = new AnnotationConfigApplicationContext(MarketDataServiceConfig.class)) {
			var settings = context.getBean(Settings.class);
			final var alphaVantage = new AlphaVantage(settings.alphaVantageUri(), settings.alphaVantageApiKey());
			JedisPubSub jedisPubSub = new JedisPubSub() {
				@Override
				public void onPMessage(String pattern, String channel, String message) {
					_logger.info("Channel {} sent message: {} on pattern {}", channel, message, pattern);
					String[] parameters = message.split("\\|");
					var name = parameters[0];
					var interval = parameters[1];
					try {
						String result;
						var cacheData = jedisPub.get(message);
						var cacheMiss = cacheData == null || cacheData.isBlank();
						if (cacheMiss) {
							_logger.info("Cache miss, querying API");
							result = alphaVantage.GetCommodityData(name, interval);
							jedisPub.setex(message, 60*5, result);
						} else {
							_logger.info("Cache hit");
							result = cacheData;
						}
						_logger.info("Publishing data length {}", result == null ? 0 : result.length());
						jedisPub.publish("MarketData.Publish", result);
					} catch (IOException | InterruptedException | URISyntaxException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}

				@Override
				public void onPSubscribe(String pattern, int subscribedChannels) {
					_logger.info("Subscribed to {}", pattern);
				}

				@Override
				public void onPUnsubscribe(String pattern, int subscribedChannels) {
					_logger.info("Unsubscribed from {}", pattern);
				}
			};

			jedisSub.psubscribe(jedisPubSub, "MarketData.Query.*");
		} catch (Exception e) {
			_logger.error("Uh oh:", e);
		} finally {
			if (jedisSub != null) {
				jedisSub.close();
			}
			if (jedisPub != null) {
				jedisPub.close();
			}
		}

		SpringApplication.run(MarketDataServiceApplication.class, args);

	}

}
