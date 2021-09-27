const express = require('express');
const getimages = require('./routes/getimage')
const saveimages = require('./routes/saveimage')
const path = require('path');
require('dotenv').config()
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var exphbs = require('express-handlebars');

app = express();
app.use('/images', getimages);
app.use('/uploadimage', saveimages)
app.use(express.static(path.join(__dirname, 'FlexPlay')));
app.use(express.static(path.join(__dirname, 'views')));

app.set('view engine', 'hbs');
// app.engine( 'hbs', exphbs());

//https://stackoverflow.com/questions/56810751/error-enoent-no-such-file-or-directory-in-express-handlebars
//https://hackersandslackers.com/handlebars-templates-expressjs/
app.engine(
    "hbs",
    exphbs({
      extname: "hbs",
      defaultLayout: false,
      layoutsDir: "views/layouts/"
    })
  );


passport.use(new GoogleStrategy({
    consumerKey: process.env.GOOGLE_CLIENT_ID,
    consumerSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://www.example.com/auth/google/callback"
  },
  function(token, tokenSecret, profile, done) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(err, user);
      });
  }
));

app.get('/', (req, res)=>{
    res.sendFile('landing.html', {root : path.join(__dirname, 'FlexPlay')})
});


app.get('/signin', (req, res)=>{
    res.render('login')
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

//https://newbedev.com/express-js-prevent-get-favicon-ico
// Didn't use express favicon
app.get('/favicon.ico', function(req, res) { 
    res.sendStatus(204);
});

app.listen(3000, ()=>{
    console.log('Running on local at 3000');
});