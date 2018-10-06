'use strict';

var mongoose = require('mongoose'),
    crypto = require('crypto'),

    Schema = mongoose.Schema,

    User = new Schema({
        username: {
            type: String,
            unique: true,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: false
        },
        hashedPassword: {
            type: String,
            required: true
        },
        salt: {
            type: String,
            required: true
        },
        created: {
            type: Date,
            default: Date.now
        },
        last_login: {
            type: String,
            required: false
        },
        status: {
            type: String,
            required: true
        },
        otp: {
            type: String,
            required: false
        },
        otp_created: {
            type: Date,
            required: false
        }
    });

User.methods.encryptPassword = function (password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

User.virtual('userId')
    .get(function () {
        return this.id;
    });

User.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = crypto.randomBytes(128).toString('hex');
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () { return this._plainPassword; });


User.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

User.methods.save_otp = function (otp) {
    
};

module.exports = mongoose.model('User', User);
