const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();

app.use(cors());
app.use(express.static('public'));

// Parse form data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Store users and exercises
const users = [];
const exercises = [];

// Create a user
app.post('/api/users', (req, res) => {
  const username = req.body.username;

  if (!username) {
    return res.json({
      error: 'username is required'
    });
  }

  const user = {
    username: username,
    _id: String(users.length + 1)
  };

  users.push(user);

  res.json(user);
});

// Add exercise to a user
app.post('/api/users/:_id/exercises', (req, res) => {
  const user = users.find(user => user._id === req.params._id);

  if (!user) {
    return res.json({
      error: 'user not found'
    });
  }

  const description = req.body.description;
  const duration = Number(req.body.duration);

  let date;

  if (req.body.date) {
    date = new Date(req.body.date);
  } else {
    date = new Date();
  }

  const exercise = {
    username: user.username,
    description: description,
    duration: duration,
    date: date.toDateString(),
    _id: String(exercises.length + 1)
  };

  exercises.push(exercise);

  res.json(exercise);
});

// Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Get exercise log
app.get('/api/users/:_id/logs', (req, res) => {
  const user = users.find(user => user._id === req.params._id);

  if (!user) {
    return res.json({
      error: 'user not found'
    });
  }

  let userExercises = exercises.filter(
    exercise => exercise.username === user.username
  );

  // Optional parameters
  const from = req.query.from;
  const to = req.query.to;
  const limit = req.query.limit;

  if (from) {
    const fromDate = new Date(from);

    userExercises = userExercises.filter(
      exercise => new Date(exercise.date) >= fromDate
    );
  }

  if (to) {
    const toDate = new Date(to);

    userExercises = userExercises.filter(
      exercise => new Date(exercise.date) <= toDate
    );
  }

  if (limit) {
    userExercises = userExercises.slice(0, Number(limit));
  }

  res.json({
    username: user.username,
    count: userExercises.length,
    _id: user._id,
    log: userExercises.map(exercise => ({
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date
    }))
  });
});

// Start server
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(
    'Your app is listening on port ' + listener.address().port
  );
});
