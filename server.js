'use strict';


const express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

require('dotenv').config()
const port = process.env.PORT || 3000;
const favicon = require('serve-favicon');
const path = require('path'); // path parsing module
const bodyParser = require('body-parser');
var logger = require('morgan');
var log             = require('./libs/log');
var methodOverride = require('method-override');
var mongoose    = require('mongoose');
var winston = require('winston');
const passport = require('passport');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); // use standard favicon
app.use(logger('dev')); // log all requests
app.use(bodyParser.urlencoded({
    extended: true
  })); // JSON parsing

app.use(bodyParser.json());

app.use(methodOverride()); // HTTP PUT and DELETE support
app.use(express.static(path.join(__dirname, "public"))); // starting static fileserver, that will watch `public` folder (in our case there will be `index.html`)

//Set up routes
const Routes = require('./routes/routes')(io);
app.use('/api', Routes);

var oauth2 = require('./libs/auth/oauth2');
app.use(passport.initialize());

require('./libs/auth/auth');
app.post('/api/oauth/token', oauth2.token);

app.get('/api/userInfo',
    passport.authenticate('bearer', { session: false }),
        function(req, res) {
            // req.authInfo is set using the `info` argument supplied by
            // `BearerStrategy`.  It is typically used to indicate a scope of the token,
            // and used in access control checks.  For illustrative purposes, this
            // example simply returns the scope in the response.
            res.json({ user_id: req.user.userId, name: req.user.username, scope: req.authInfo.scope })
        }
);


//if no routes found above then 404 and 500 error handling.
app.use(function(req, res, next){
    res.status(404);
    log.debug('Not found URL: %s',req.url);
    res.send({ error: 'Not found' });
    return;
});

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
    return;
});

//app.listen(port, function(){
http.listen(port, function(){
    log.info('Express server listening on port: ' + port);
});