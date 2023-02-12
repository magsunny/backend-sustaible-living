const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dbConnect = require('./db/dbConnect.js');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const User = require('./db/userModel.js');
const auth = require('./auth');

// connection to database

dbConnect();

// handle Cross-Origin Ressource Sharing (CORS) errors

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

// body parser configuration

app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
  res.json({ message: 'Server läuft =)' });
  next();
});

// register endpoint

  app.post('/register', (req, res) => {
    
  bcrypt
    .hash(req.body.password, 10) // password hashing 10 times
    .then((hashedPassword) => { // create user model with new data
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });
    
    user 
      .save() // save new user in database
      .then((result) => {
        res.status(201).send({
          message: 'User erfolgreich hinzugefügt',
          result,
        });
      })
      .catch((error) => {
        res.status(500).send({
          message: 'User konnte nicht hinzugefügt werden',
          error,
        });
      });
    })
    .catch((error) => { 
      res.status(500).send({
        message: 'Passwort konnte nicht gehasht werden',
        error,
      });
    });

});

// login endpoint

app.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }) // checks if email exists, mongoose method
      .then((user) => {
        bcrypt.compare(req.body.password, user.password) // compare entered psw with hashed psw in database bcrypt method
        .then((checkPassword) => {
          if(!checkPassword) { // password check
            return res.status(400).send({
              message: 'Passwort stimmt nicht überein',
              error,
            });
          }
          const token = jwt.sign( // create JWT token
          {
            userId: user._id,
            userEmail: user.email,
          },
          'RANDOM-TOKEN',
          { expiresIn: '24h', }
          );

          res.status(200).send({
            message: 'Login erfolgreich',
            email: user.email,
            token,
          });
        })
        .catch((error) => {
          res.status(400).send({
            message: 'Passwort stimmt nicht überein',
            error,
          });
        });
      })
      .catch((error) => {
        res.status(404).send({
          message: 'E-mail wurde nicht gefunden',
          error,
        });
      });
});

// free endpoint

app.get('/free-endpoint', (req, res) => {
  res.json({ message: 'Du kannst jederzeit auf mich zugreifen' });
});

// authentication endpoint

app.get('/auth-endpoint', auth, (req, res) => {
  res.json({ message: 'Du bist authorisiert und darfst auf mich zuzugreifen' });
});


module.exports = app;

