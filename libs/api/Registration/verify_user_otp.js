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

module.exports.verify = function(req, res){
    //if no get body send error
    if(!(req.query.mobile && req.query.otp)){
        res.status(400);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ "error": "Mobile Number and otp are required" }));
        return;
    };

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
            res.send(JSON.stringify({ "error": "Mobile Number is Not Registered" }));
            return;
        }else if(user.otp != req.query.otp){
            res.status(200);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ "status": "fail"}));
            return;
        }else if(user.otp === req.query.otp){
            //test otp is expired or not
            var user_otp_expiration = parseInt(process.env.user_otp_expiration) * 1000;
            var otp_created = (user.otp_created).getTime();
            var test_time = otp_created + user_otp_expiration;
            var current_time = (new Date).getTime();
            if(current_time < test_time){
                    //change user status = verified
                    User.updateOne(
                    { username: req.query.mobile },
                    { $set: { status: "verified"} },
                    function(err, user){
                        if (err){
                            res.status(500);
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify({ "error": "Verified Status update failed" }));
                            console.log(err);
                            return;
                        };
                        res.status(200);
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify({ "status": "ok"}));
                        return;
                    }
                );
                return
            }else{
                res.status(200);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ "status": "otp expired"}));
                return;
            };
        };
    });
};