const express = require('express');
const Twitter = require('twit');

const app = express();
const client = new Twitter({
    consumer_key: 'sXMi07AokvknicN3OGZ4sK6Gl',
    consumer_secret: 'RXifmM5T4UfWZ2X3Esryfzgeg654phXxM5jcwgTgiR6V2QAEfT',
    access_token: '820778792528605186-vVgP5lFxIrfSb107l1It98FnhDjVH4K',
    access_token_secret: 'aVcjZ4GBfrOQ5uUvd1iwBnQJgEmcRMFHmH7AMk6xP7tbF'
});

app.use(require('cors')());
app.use(require('body-parser').json());

app.get('/api/user', (req, res) => {
  client
    .get('account/verify_credentials')
    .then(user => {
      res.send(user);
    })
    .catch(error => {
      res.send(error);
    });
});

let cache = [];
let cacheAge = 0;

app.get('/api/home', (req, res) => {
  if (Date.now() - cacheAge > 60000) {
    cacheAge = Date.now();
    const params = { tweet_mode: 'extended', count: 200 };
    if (req.query.since) {
      params.since_id = req.query.since;
    }
    client
      .get(`statuses/home_timeline`, params)
      .then(timeline => {
        cache = timeline;
        res.send(timeline);
      })
      .catch(error => res.send(error));
  } else {
    res.send(cache);
  }
});

app.post('/api/favorite/:id', (req, res) => {
  const path = req.body.state ? 'create' : 'destroy';
  client
    .post(`favorites/${path}`, { id: req.params.id })
    .then(tweet => res.send(tweet))
    .catch(error => res.send(error));
});

app.post('/api/retweet/:id', (req, res) => {
  if(req.body.state) {
    client
    .post(`statuses/retweet/${req.params.id}`)
    .then(tweet => res.send(tweet))
    .catch(error => res.send(error));
  } else {
    client
    .post(`statuses/unretweet/${req.params.id}`)
    .then(tweet => res.send(tweet))
    .catch(error => res.send(error));
  }
});

app.listen(3000, () => console.log('Server running'));
