const jsonServer = require('json-server');
const server = jsonServer.create();
const compression = require('compression');

const express = require('express');
const app = express();
const path = require('path');

const port = process.env.PORT || 3000;

// json server

var server = jsonServer.create()
var db = {
  "items": [
    {
      "id": "2",
      "name": "Dollar Edged Lower As Investors Analyze Details of Tax Overhaul",
      "symbol": "GBP/USD",
      "description": "The White House has said the tax overhaul will stimulate the economy and lift inflation; stronger growth could lead the Federal Reserve to raise rates at a faster clip, increasing the dollar’s appeal to yield-seeking investors.",
      "icon": "description",
      "created": "07/13/2017 11:05 AM"
    },
    {
      "id": "3",
      "name": "Dollar Higher on Renewed Political Unrest in Europe",
      "symbol": "EUR/USD",
      "description": "The White House has said the tax overhaul will stimulate the economy and lift inflation; stronger growth could lead the Federal Reserve to raise rates at a faster clip, increasing the dollar’s appeal to yield-seeking investors.",
      "icon": "description",
      "created": "06/15/2016 09:02 AM"
    },
    {
      "id": "4",
      "name": "Dollar Edged Lower As Investors Analyze Details of Tax Overhaul",
      "symbol": "GBP/USD",
      "description": "The White House has said the tax overhaul will stimulate the economy and lift inflation; stronger growth could lead the Federal Reserve to raise rates at a faster clip, increasing the dollar’s appeal to yield-seeking investors.",
      "icon": "description",
      "created": "07/13/2017 11:05 AM"
    },
    {
      "id": "5",
      "name": "Dollar Higher on Renewed Political Unrest in Europe",
      "symbol": "EUR/USD",
      "description": "The White House has said the tax overhaul will stimulate the economy and lift inflation; stronger growth could lead the Federal Reserve to raise rates at a faster clip, increasing the dollar’s appeal to yield-seeking investors.",
      "icon": "description",
      "created": "06/15/2016 09:02 AM"
    },
    {
      "name": "article 1",
      "symbol": "GBP/USD",
      "description": "aasas",
      "id": "61b302c5-7189-4b68-ab66-776f53361998",
      "icon": "description",
      "created": "2018-01-04T22:09:35.415Z"
    },
    {
      "name": "zxzx",
      "symbol": "GBP/USD",
      "description": "zxzxzx",
      "id": "33200d62-90fa-4b4f-a107-74891158bfa8",
      "icon": "description",
      "created": "2018-01-04T23:00:58.270Z"
    },
    {
      "name": "article 1",
      "symbol": "XAU/USD",
      "description": "asdasd",
      "id": "f7ef2fa0-0baf-4fd2-89f3-335000f598db",
      "icon": "description",
      "created": "2018-01-04T23:13:20.720Z"
    }
  ]
}
var router = jsonServer.router(db)
var middlewares = jsonServer.defaults()


server.use(middlewares)
server.use(router)
server.listen(3000, function () {
  console.log('JSON Server is running')
})

/*
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
server.use(middlewares);
server.use(router);
server.listen(port);
*/

// Gzip
app.use(compression());

// Run the app by serving the static files in the dist directory
app.use(express.static(__dirname + '/dist'));

// Start the app by listening on the default Heroku port
app.listen(port);

// For all GET requests, send back index.html so that PathLocationStrategy can be used
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

console.log(`Server listening on ${port}`);
