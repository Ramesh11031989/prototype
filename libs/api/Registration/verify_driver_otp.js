'use strict';

var bodyParser = require('body-parser');
// create application/json parser
var jsonParser = bodyParser.json();

require('dotenv').config()
const port = process.env.PORT || 3000;
var libs = process.cwd() + '/libs/';

var log = require(libs + 'log');
var db = require(libs + 'db/mongoose');
var Driver = require(libs + 'model/driver');

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
   
    //Check if Mobile Number exist in driver collection
    Driver.findOne({'username': req.query.mobile}, function(err, driver) {
        if (err){
            res.status(500);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ "error": "Not able to get driver from database" }));
            console.log(err);
            return;
        }
        if(!driver){
            res.status(400);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ "error": "Mobile Number is Not Registered" }));
            return;
        }else if(driver.otp === req.query.otp){
            //test otp is expired or not
            var driver_otp_expiration = parseInt(process.env.driver_otp_expiration) * 1000;
            var otp_created = (driver.otp_created).getTime();
            var test_time = otp_created + driver_otp_expiration;
            var current_time = (new Date).getTime();
            if(current_time < test_time){
                    //change driver status = verified
                    Driver.updateOne(
                    { username: req.query.mobile },
                    { $set: { status: "verified"} },
                    function(err, driver){
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
        }else if(driver.otp != req.query.otp){
            res.status(200);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ "status": "fail"}));
            return;
        };
    });
};