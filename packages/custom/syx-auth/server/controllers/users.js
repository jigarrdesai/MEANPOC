'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    async = require('async'),
    config = require('meanio').loadConfig(),
    crypto = require('crypto'),
    nodemailer = require('nodemailer'),
    templates = require('../template'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
	request = require('request'); //https://npmjs.org/package/node-jsonwebtoken


var usersWithCreateAccess = ['super', 'tenant', 'admin'];
/**
 * Send reset password email
 */
function sendMail(mailOptions) {
    var transport = nodemailer.createTransport(config.mailer);
    transport.sendMail(mailOptions, function(err, response) {
        if (err) return err;
        return response;
    });
}

function hasCreateAccess(current, type) {
	return (usersWithCreateAccess.indexOf(current) < usersWithCreateAccess.indexOf(type)) || (current == 'admin' && type == 'user') || (current == 'admin' && type == 'admin');
}

module.exports = function(MeanUser) {
    return {
		common: function(req, res, next) {
			
			var reqst = request({
                method: req.method,
                uri: MeanUser.apiUrl + req.url,
                body: req.body,
                json: true
            });

            // var reqst = request({
            //     method: req.method,
			// 	headers: {
			// 		header: 'Host:' + MeanUser.userHost
			// 	},
            //     uri: MeanUser.proxyUrl + req.url,
            //     body: req.body,
            //     json: true
            // });
            
            reqst.pipe(res);
		}
    };
}