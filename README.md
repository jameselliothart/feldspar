# Feldspar

## Architecture

- redis pub/sub
- node connection to redis
  - websocket to react FE
  - only facilitates redis <--> FE messages?
  - maybe calls to python fin model (below)
  - (un)subscribe to asset tickers
- .net core service
  - reads [commodity ticking data](https://www.alphavantage.co/)
  - pubs to redis
  - pull assets available to poll
  - receive subscriptions from node for which to poll
- python financial modeling
  - exposed via protocol buffer

## Notes

```sh
docker run -it -d -p 6379:6379 redis
docker-compose -f ./docker-compose.debug.yml up --build
```

Docker Images: Build Image

https://{your site name}.scm.azurewebsites.net/DebugConsole view env vars

in redis container
```sh
redis-cli
PUBLISH MarketData.Query "BRT|monthly"
```

if response.json() fails to parse, use response.text() to see what is actually getting returned


## Acknowledgements

- [Getting started with react, express, and socket-io](https://medium.com/@vrinmkansal/getting-started-with-react-express-and-socket-io-658bbd441a9a)
- [Socket-io React tutorial](https://developer.okta.com/blog/2021/07/14/socket-io-react-tutorial)

- [How to Dockerize React app](https://www.howtogeek.com/devops/how-to-dockerise-a-react-app/)
- [Serving React with nginx](https://stackoverflow.com/questions/59973882/proxying-react-app-using-nginx-on-docker-compose)
- [Full stack React app with Docker](https://www.section.io/engineering-education/build-and-dockerize-a-full-stack-react-app-with-nodejs-and-nginx/)

- [Node caching - actually used in C#](https://www.digitalocean.com/community/tutorials/how-to-implement-caching-in-node-js-using-redis)
- [can use x,y with line chart](https://www.chartjs.org/docs/latest/axes/cartesian/time.html#parser) - hard to find

## Road Map

- [x] asset selector
  - [ ] pass asset query from web -> websocket -> redis pub -> retrieve redis sub -> websocket -> web
  - [] set curve colors but keep consistent
- [] saving selections to favorites
- [x] caching market data in redis - can set expiry
- [] restricting from/to dates
- [] deploy to azure
