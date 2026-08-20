// index.js
// where your node app starts

require('dotenv').config();

var express = require('express');
var app = express();

// Enable CORS
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));

// Serve static files
app.use(express.static('public'));

// Home page
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Header Parser API
app.get('/api/whoami', function (req, res) {
  res.json({
    ipaddress: req.ip,
    language: req.get('Accept-Language'),
    software: req.get('User-Agent')
  });
});

// Start server
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log(
    'Your app is listening on port ' + listener.address().port
  );
});