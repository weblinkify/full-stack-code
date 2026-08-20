var express = require('express');
var app = express();

var cors = require('cors');

app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Timestamp Microservice
app.get("/api/timestamp/:date?", function (req, res) {
  var dateInput = req.params.date;

  var date;

  // No date supplied
  if (!dateInput) {
    date = new Date();
  } else if (/^\d+$/.test(dateInput)) {
    // Unix timestamp in milliseconds
    date = new Date(Number(dateInput));
  } else {
    // Date string
    date = new Date(dateInput);
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

// Listen on port
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log(
    'Your app is listening on port ' + listener.address().port
  );
});