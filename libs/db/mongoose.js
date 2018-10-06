'use strict';


require('dotenv').config()
var crypto = require('crypto');


var mongoose    = require('mongoose');
var log         = require('../log');

mongoose.connect(process.env.mongodb_url, { useNewUrlParser: true });    
var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});

db.once('open', function callback () {
    log.info("Connected to DB!");
});

module.exports = mongoose;

