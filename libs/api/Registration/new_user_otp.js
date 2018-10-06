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

var random = require('math-random');

module.exports.send_otp = function(req, res){
    //if no get body send error
    if (!req.query.mobile){
        res.status(400);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ "error": "Mobile Number is required" }));
        return;
    }

    //Validate Mobile Number
    //code for validation
    //
    //
   
    //Check if Mobile Number exist in user collection
    User.findOne({'username': req.query.mobile}, function(err, user) {
        if (err){
            res.status(500);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ "error": "Not able to get user from database" }));
            console.log(err);
            return;
        }
        if(!user){
            res.status(400);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ "error": "Mobile Number is Not Registard" }));
            return;
        };
        //Save otp in database at users/drivers document(username = Mobile Number)
        User.updateOne(
            { username: req.query.mobile },
            { $set: { otp: new_otp, otp_created: Date.now()} },
            function(err, user){
                if (err){
                    res.status(500);
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({ "error": "Not able to update otp in database" }));
                    console.log(err);
                    return;
                };
                //Send Otp to Mobile phone
                //Code for sending otp to moble(hit otp services provider api)
                //
                //
                if (err){
                    res.status(500);
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({ "error": "otp sending failed" }));
                    console.log(err);
                    return;
                };
                res.status(200);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ "status": "ok"}));
                return;
            }
        );
    });
    //Create New otp
    var generate_otp = function(){
        return Math.floor(100000 + random() * 900000);
    };
    var new_otp = generate_otp();
};