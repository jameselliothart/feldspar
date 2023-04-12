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
