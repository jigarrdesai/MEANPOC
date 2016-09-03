'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Event = mongoose.model('Event'),
    async = require('async'),
    config = require('meanio').loadConfig(),
    crypto = require('crypto'),
    nodemailer = require('nodemailer'),
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
	return usersWithCreateAccess.indexOf(current) < usersWithCreateAccess.indexOf(type);
}

module.exports = function(SyxEvent) {
    return {
		common: function(req, res, next) {
			
			var reqst = request({
                method: req.method,
                uri: SyxEvent.apiUrl + req.url,
                body: req.body,
                json: true
            });
            
			reqst.on('error', function(){
				return res.status(400).send([{
					msg: 'Error',
					param: null
				}]);
			});

            reqst.pipe(res);
		},
		pgCommon: function(req, res, next) {
			
			var reqUrl = req.url.replace("api/pg", "pg/api");
			var reqst = request({
                method: req.method,
                uri: SyxEvent.apiUrl + reqUrl,
                body: req.body,
                json: true
            });

            // var reqst = request({
            //     method: req.method,
			// 	headers: {
			// 		header: 'Host:' + SyxEvent.eventHost
			// 	},
            //     uri: SyxEvent.proxyUrl + reqUrl,
            //     body: req.body,
            //     json: true
            // });
            
			reqst.on('error', function(err){
				return res.status(400).send([{
					msg: 'Error',
					param: null
				}]);
			});

            reqst.pipe(res);
		}
    };
}