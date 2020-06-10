require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3000;

const app = express();

const session = require('express-session');
app.use(session({
  secret: "I am the secret of Oquiz from Bifrost",
  saveUninitialized: true,
  resave: true,
  cookie: {
    secure: false,
    maxAge: (1000*60*60)
  }
}));

app.set('view engine', 'ejs');
app.set('views', 'app/views');

app.use(express.urlencoded({extended: true}));

app.use(express.static('integration'));

const userMiddleware = require('./app/middlewares/user');
app.use(userMiddleware.sessionToLocals);

const router = require ('./app/router');
app.use(router);

// on lance le serveur, en écoute sur le port défini
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
  