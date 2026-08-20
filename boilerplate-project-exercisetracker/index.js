const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Users
const users = [];

// Create user
app.post('/api/users', (req, res) => {
  const username = req.body.username;

  const user = {
    username: username,
    _id: String(users.length + 1),
    log: []
  };

  users.push(user);

  res.json({
    username: user.username,
    _id: user._id
  });
});

// Get all users
app.get('/api/users', (req, res) => {
  res.json(
    users.map(user => ({
      username: user.username,
      _id: user._id
    }))
  );
});

// Add exercise
app.post('/api/users/:_id/exercises', (req, res) => {
  const user = users.find(
    user => user._id === req.params._id
  );

  if (!user) {
    return res.json({
      error: 'user not found'
    });
  }

  const date = req.body.date
    ? new Date(req.body.date)
    : new Date();

  const exercise = {
    description: req.body.description,
    duration: Number(req.body.duration),
    date: date.toDateString()
  };

  user.log.push(exercise);

  // FCC expects the user object with exercise fields added
  res.json({
    username: user.username,
    _id: user._id,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date
  });
});

// Get exercise log
app.get('/api/users/:_id/logs', (req, res) => {
  const user = users.find(
    user => user._id === req.params._id
  );

  if (!user) {
    return res.json({
      error: 'user not found'
    });
  }

  let log = [...user.log];

  // Filter from date
  if (req.query.from) {
    const from = new Date(req.query.from);

    log = log.filter(exercise => {
      return new Date(exercise.date) >= from;
    });
  }

  // Filter to date
  if (req.query.to) {
    const to = new Date(req.query.to);

    log = log.filter(exercise => {
      return new Date(exercise.date) <= to;
    });
  }

  // Limit results
  if (req.query.limit) {
    log = log.slice(0, Number(req.query.limit));
  }

  res.json({
    username: user.username,
    count: log.length,
    _id: user._id,
    log: log
  });
});

const listener = app.listen(
  process.env.PORT || 3000,
  () => {
    console.log(
      'Your app is listening on port ' +
      listener.address().port
    );
  }
);