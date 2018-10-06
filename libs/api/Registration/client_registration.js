'use strict';

require('dotenv').config()
var libs = process.cwd() + '/libs/';

var log = require(libs + 'log');
var db = require(libs + 'db/mongoose');

var Client = require(libs + 'model/client');

module.exports.register = function(req, res){
    //if no post body send error
    if (!(req.body.name && req.body.clientId && req.body.clientSecret && req.body)){
        res.status(400);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ "error": "client name, client Id and client Secret are required" }));
        return;
    }

    //Validate Request Data

    //Check if client Id exist


    //Create New Client
    var client = new Client({
        name: req.body.name,
        clientId: req.body.clientId,
        clientSecret: req.body.clientSecret
    });
    client.save(function (err, client) {

        if (!err) {
            res.setHeader('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({ "status": "ok"}));
            log.info('New client, clientId: ' + client.clientId + ' clientSecret: ' + client.clientSecret);
            return;
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({ "error": err}));
            log.error(err);
            return;
        }
    });
};