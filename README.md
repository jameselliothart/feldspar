# Feldspar

Feldspar is a market data visualization tool.
It currently retrieves monthly prices for a variety of commodities products for users to compare on a common chart.
It utilizes the [Alpha Vantage][alpha-vantage] API for market data retrieval.

## Architecture

### Overview

Feldspar has a microservice-based architecture coordinated by using **redis pub/sub** as a messaging system.
This is excessive complexity for the initial version of the application (which essentially responds to a user's asset selection by querying an external API and displaying the data on the screen).
However, is allows the flexibility of easily adding new or swapping out different services in various languages as the project expands.

### Components

- web - **React**
  - The front end UI of the application
  - Has a websocket client connection to the *middle_tier*
  - Served with **nginx**
- middle_tier - **Node.js**
  - Websocket server for the web UI
  - Publishes messages to the **redis pub/sub** channel MarketData.Query to request market data
  - Subscribes to the MarketData.Publish channel to forward market data to the UI
  - Note that the *middle_tier* is agnostic to what ultimately sources the data as it only interacts with the redis channels
- MarketDataService - **.NET 6 C#**
  - Listens to the MarketData.Query channel for market data requests
  - Checks the **redis cache** for the requested market data key (e.g. `WTI|MONTHLY`)
  - If there is no cache data:
    - Queries from [Alpha Vantage][alpha-vantage]
    - Caches the data with a 5min expiry
  - Publishes market data to MarketData.Publish for consumption
- jMarketDataService - **Java 17 Spring Boot**
  - A functionally equivalent implementation of the MarketDataService in **Java**
  - Note the ease with which these two services can be switched out because they interface with the rest of the application only via redis channels

### Deployment

- Orchestrated via **docker compose**
- Images uploaded to **Azure Container Registry**
- Deployed as an **Azure** multi-container app

[alpha-vantage]: https://www.alphavantage.co
## Development Notes

### Docker

Running redis standalone

```sh
docker run -it -d -p 6379:6379 redis`
```

Specifying a docker-compose file to run

```sh
docker-compose -f ./docker-compose.debug.yml up --build`
```

Build an image with VS Code command palette `Docker Images: Build Image`

### Azure

View environment variables via https://{your site name}.scm.azurewebsites.net/DebugConsole

### Redis

Use pub/sub inside a redis container via `redis-cli`
```sh
# terminal 1
redis-cli
SUBSCRIBE MarketData.Publish
```

```sh
# terminal 2
redis-cli
PUBLISH MarketData.Query "WTI|monthly"
```

### Gradle

Build solution

```sh
./gradlew build
```

Run

```sh
./gradlew bootRun
```

### JavaScript

If `response.json()` fails to parse, use `response.text()` to see what is actually getting returned

## Road Map

- [x] asset selector
  - [x] pass asset query from web -> websocket -> redis pub -> retrieve redis sub -> websocket -> web
  - [ ] consistency of curve colors on selection change
- [ ] saving selections to favorites
- [x] caching market data in redis - can set expiry
- [ ] restricting from/to dates
- [x] deploy to Azure
- [ ] add some kind of financial modeling service in Python

## References

- [Getting started with react, express, and socket-io](https://medium.com/@vrinmkansal/getting-started-with-react-express-and-socket-io-658bbd441a9a)
- [Socket-io React tutorial](https://developer.okta.com/blog/2021/07/14/socket-io-react-tutorial)

- [How to Dockerize React app](https://www.howtogeek.com/devops/how-to-dockerise-a-react-app/)
- [Serving React with nginx](https://stackoverflow.com/questions/59973882/proxying-react-app-using-nginx-on-docker-compose)
- [Full stack React app with Docker](https://www.section.io/engineering-education/build-and-dockerize-a-full-stack-react-app-with-nodejs-and-nginx/)

- [Node redis caching - actually used in C#](https://www.digitalocean.com/community/tutorials/how-to-implement-caching-in-node-js-using-redis)
- [Use x,y with line chart](https://www.chartjs.org/docs/latest/axes/cartesian/time.html#parser) - hard to find

- [Wildcard subscribe with node redis](https://github.com/redis/node-redis/blob/master/docs/pub-sub.md) - hard to find
- [Spring Bean Configuration](https://blog.codeleak.pl/2015/09/placeholders-support-in-value.html)
- [Basic Bean Tutorial](https://www.geeksforgeeks.org/spring-bean-annotation-with-example/)
