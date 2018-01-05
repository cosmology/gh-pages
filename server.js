const jsonServer = require('json-server');
const server = jsonServer.create();
const compression = require('compression');

const express = require('express');
const app = express();
const path = require('path');

const port = process.env.PORT || 4000;

// json server
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
