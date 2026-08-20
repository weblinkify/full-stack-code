var express = require('express');
var app = express();

var cors = require('cors');

app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// Timestamp API
app.get("/api/:date?", function (req, res) {
  var date;

  // No date provided
  if (!req.params.date) {
    date = new Date();
  } 
  // Unix timestamp
  else if (/^\d+$/.test(req.params.date)) {
    date = new Date(parseInt(req.params.date));
  } 
  // Date string
  else {
    date = new Date(req.params.date);
  }

  // Invalid date
  if (isNaN(date.getTime())) {
    return res.json({
      error: "Invalid Date"
    });
  }

  // Valid date
  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});

var listener = app.listen(process.env.PORT || 3000, function () {
  console.log(
    "Your app is listening on port " + listener.address().port
  );
});