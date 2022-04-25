require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World'));

app.get('/auth/github', (req, res) => {
  const {code} = req.query;
  axios.post('https://github.com/login/oauth/access_token', {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code
  }, {
    headers: {
      'Accept': 'application/json'
    }
  }).then(resp => {
    const {access_token} = resp.data;
    axios.get(`https://api.github.com/user`, {
      headers: {
        'Authorization': `token ${access_token}`,
        'Accept': 'application/json'
      }
    }).then(resp => {
      console.log(resp);
      res.json(resp.data);
    }).catch(err => {
      console.log(err);
      res.send(err);
    })
  }).catch(err => {
    console.log(err);
    res.send(err)
  })
});

app.listen(3000, () => console.log("Server listening on port 3000"));
