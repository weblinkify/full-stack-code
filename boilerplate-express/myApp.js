require('dotenv').config();

let express = require('express');
let bodyParser = require('body-parser');

let app = express();

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));

// Request logger
app.use(function(req, res, next) {
  console.log(req.method + ' ' + req.path + ' - ' + req.ip);
  next();
});

// Static files
app.use('/public', express.static(__dirname + '/public'));

// Home page
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// JSON route
app.get('/json', function(req, res) {
  let response = {
    message: 'Hello json'
  };

  if (process.env.MESSAGE_STYLE === 'uppercase') {
    response.message = response.message.toUpperCase();
  }

  res.json(response);
});

// Time server
app.get('/now', function(req, res, next) {
  req.time = new Date().toString();
  next();
}, function(req, res) {
  res.json({
    time: req.time
  });
});

// Echo server
app.get('/:word/echo', function(req, res) {
  res.json({
    echo: req.params.word
  });
});

// GET /name
app.get('/name', function(req, res) {
  res.json({
    name: req.query.first + ' ' + req.query.last
  });
});

// POST /name
app.post('/name', function(req, res) {
  res.json({
    name: req.body.first + ' ' + req.body.last
  });
});

module.exports = app;