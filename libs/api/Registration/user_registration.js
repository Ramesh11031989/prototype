'use strict';

var bodyParser = require('body-parser');
// create application/json parser
var jsonParser = bodyParser.json();

require('dotenv').config()
const port = process.env.PORT || 3000;
var libs = process.cwd() + '/libs/';

var log = require(libs + 'log');
var db = require(libs + 'db/mongoose');

var User = require(libs + 'model/user');
var AccessToken = require(libs + 'model/accessToken');
var RefreshToken = require(libs + 'model/refreshToken');
module.exports.register = function(req, res){
    //if no post body send error
    if (!(req.body.username && req.body.password && req.body && req.body.name)){
        res.status(400);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ "error": "Username and Password are required" }));
        return;
    }

    //Validate Request and email

    //Check if user exist

    const email_id = req.body.email ? req.body.email : "";
    //Create New User
    var user = new User({
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        email: email_id,
        last_login: "",
        status: "unverified",
        otp: "",
        otp_created: null
    });

    user.save(function (err, user) {
        if (!err) {
            res.setHeader('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({ "status": "ok"}));
            log.info('New user, username: ' + user.username + ' Password: ' + user.password);
            return;
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({ "error": err}));
            log.error(err);
            return;
        }
    });
};