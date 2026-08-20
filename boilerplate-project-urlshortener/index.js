require('dotenv').config();

const express = require('express');
const cors = require('cors');
const dns = require('dns');

const app = express();

const port = process.env.PORT || 3000;

// Basic Configuration
app.use(cors());

// Serve static files
app.use('/public', express.static(`${process.cwd()}/public`));

// Parse URL-encoded POST data
app.use(express.urlencoded({ extended: false }));

// Home page
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Store shortened URLs
const urls = [];
let nextId = 1;

// POST URL to shorten
app.post('/api/shorturl', function (req, res) {
  const originalUrl = req.body.url;

  if (!originalUrl) {
    return res.json({
      error: 'invalid url'
    });
  }

  let url;

  try {
    url = new URL(originalUrl);
  } catch (err) {
    return res.json({
      error: 'invalid url'
    });
  }

  // Only allow http and https URLs
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return res.json({
      error: 'invalid url'
    });
  }

  // Verify that the hostname exists
  dns.lookup(url.hostname, function (err) {
    if (err) {
      return res.json({
        error: 'invalid url'
      });
    }

    // Check if URL already exists
    const existing = urls.find(function (item) {
      return item.original_url === originalUrl;
    });

    if (existing) {
      return res.json(existing);
    }

    const shortUrl = {
      original_url: originalUrl,
      short_url: nextId
    };

    urls.push(shortUrl);
    nextId++;

    res.json(shortUrl);
  });
});

// Redirect using short URL
app.get('/api/shorturl/:short_url', function (req, res) {
  const shortUrl = Number(req.params.short_url);

  const found = urls.find(function (item) {
    return item.short_url === shortUrl;
  });

  if (!found) {
    return res.json({
      error: 'No short URL found for the given input'
    });
  }

  res.redirect(found.original_url);
});

// Start server
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});