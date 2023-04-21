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

docker run -it -d -p 6379:6379 redis

## Acknowledgements

- [Getting started with react, express, and socket-io](https://medium.com/@vrinmkansal/getting-started-with-react-express-and-socket-io-658bbd441a9a)
- [Socket-io React tutorial](https://developer.okta.com/blog/2021/07/14/socket-io-react-tutorial)

- [How to Dockerize React app](https://www.howtogeek.com/devops/how-to-dockerise-a-react-app/)
- [Serving React with nginx](https://stackoverflow.com/questions/59973882/proxying-react-app-using-nginx-on-docker-compose)
- [Full stack React app with Docker](https://www.section.io/engineering-education/build-and-dockerize-a-full-stack-react-app-with-nodejs-and-nginx/)
