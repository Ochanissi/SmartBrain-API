const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/authorization');

// const db = knex({
//   client: 'pg',
//   connection: {
//     connectionString : process.env.SMARTBRAIN_DATABASE_URL,
//     ssl: true
//   }
// });

// const db = knex({
//   client: 'pg',
//   connection: {
//     host : '127.0.0.1',
//     user : 'postgres',
//     password : 'YOUR_DB_PASSWORD_HERE',
//     database : 'smart-brain'
//   }
// });

// const db = knex({
//   client: 'pg',
//   connection: {
//     host : process.env.POSTGRES_HOST,
//     user : process.env.POSTGRES_USER,
//     password : process.env.POSTGRES_PASSWORD,
//     database : process.env.POSTGRES_DB
//   }
// });

// console.log(process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD);

//Database Setup
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.SMARTBRAIN_DATABASE_URL,
    ssl: 'true',
  },
});

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.post('/signin', signin.signinAuthentication(db, bcrypt));
app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});
app.get('/profile/:id', auth.requireAuth, (req, res) => {
  profile.handleProfileGet(req, res, db);
});
app.post('/profile/:id', auth.requireAuth, (req, res) => {
  profile.handleProfileUpdate(req, res, db);
});
app.put('/image', auth.requireAuth, (req, res) => {
  image.handleImage(req, res, db);
});
app.post('/imageurl', auth.requireAuth, (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(process.env.PORT || process.env.SMARTBRAIN_API_PORT || 5005, () => {
  console.log(
    `app is running on port 3000 ${
      process.env.PORT || process.env.SMARTBRAIN_API_PORT || 5005
    }`
  );
});
