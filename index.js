var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var mongo = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var session = require('express-session');
var mustacheExpress = require('mustache-express');

mongoose.connect('mongodb://localhost:27017/voted')

app.engine('html', mustacheExpress('./pages/partials', 'html'));

app.set('view engine', 'mustache');
app.set('views', './pages')

app.use(session({
  secret: "test1234",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    expires:false
  }
}))

app.use('/', require('./routes/main')(express));
app.use('/register', require('./routes/register')(express));
app.use('/login', require('./routes/login')(express));
app.use('/logout', require('./routes/logout')(express));
app.use('/polls/new', require('./routes/new-poll')(express));
app.use('/polls/', require('./routes/poll.js')(express));
app.use('/user/', require('./routes/user.js')(express));

app.listen(3000, () => { console.log("Listening on 3000") });
