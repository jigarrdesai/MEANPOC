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
    templates = require('../template'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'); //https://npmjs.org/package/node-jsonwebtoken


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
        /**
         * Create event
         */
        create: function(req, res, next) {

			var current = req.body.current;

			if(!current.id || !current.type || usersWithCreateAccess.indexOf(current.type) < 0) {
				res.status(400).json({
					msg: 'Uauthorized Access',
					param: null
				});
			}

            var event = new Event(req.body);

			// because we set our user.provider to local our models/user.js validation will always be true
			req.assert('name', 'You must enter a name').notEmpty();
			req.assert('venue', 'You must enter a venue').notEmpty();
			req.assert('description', 'You must enter description').notEmpty();
			req.assert('start', 'You must enter valid start date').notEmpty();
			req.assert('end', 'You must enter valid start date').notEmpty();
			req.assert('price', 'Enter valid amount').notEmpty();
			
			if(current.type == 'admin') {
				event.admin = current.id;
				event.tenant = current.tenant._id;
			} else if(current.type == 'tenant') {
				event.tenant = current.id;

				req.assert('admin', 'Select Proper admin').notEmpty();
			} else {
				req.assert('admin', 'Select Proper admin').notEmpty();
				req.assert('tenant', 'Select Proper tenant').notEmpty();
			}
			
			var errors = req.validationErrors();
			if (errors) {
				return res.status(400).send(errors);
			}

			event.save(function(err) {
				if (err) {
					switch (err.code) {
						case 11000:
						case 11001:
							res.status(400).json([{
								msg: 'Username already taken',
								param: 'username'
							}]);
							break;
						default:
							var modelErrors = [];

							if (err.errors) {

								for (var x in err.errors) {
									modelErrors.push({
										param: x,
										msg: err.errors[x].message,
										value: err.errors[x].value
									});
								}

								res.status(400).json(modelErrors);
							}
					}
					return res.status(400);
				}
				
				return res.status(200).json({
					id: event.id
				});
			});
        },

        /**
         * Find user by id
         */
        single: function(req, res, next) {

			var id = req.params.id;
			if(!id) {
				return res.status(400).send([{
					msg: 'ID required',
					param: 'id'
				}]);
			}

            Event.findOne({
                _id: id
            })
			.populate('admin')
			.populate('tenant')
			.exec(function(err, event) {
                if(err) {
					if(err.kind == 'ObjectId') {
						return res.status(400).json([{
							msg: 'Event Not Found',
							param: 'id'
						}]);
					}
					return res.status(400).json([{
						msg: 'Internal error',
						param: null
					}]);
				}

				return res.status(200).json({
					event: event.toJSON()
				});
            });
        },

		/**
         * Update user by id (Role based)
         */
		updateSingle: function(req, res, next) {

			var current = req.body.current;

			if(!current || !current.id || !current.type || usersWithCreateAccess.indexOf(current.type) < 0) {
				res.status(400).json({
					msg: 'Uauthorized Access',
					param: null
				});
			}

			req.assert('name', 'You must enter a name').notEmpty();
			req.assert('venue', 'You must enter a venue').notEmpty();
			req.assert('description', 'You must enter description').notEmpty();
			req.assert('start', 'You must enter valid start date').notEmpty();
			req.assert('end', 'You must enter valid start date').notEmpty();
			req.assert('price', 'Enter valid amount').notEmpty();

			if(current.type == 'admin') {
				event.admin = current.id;
				event.tenant = current.tenant._id;
			} else if(current.type == 'tenant') {
				event.tenant = current.id;

				req.assert('admin', 'Select Proper admin').notEmpty();
			} else {
				req.assert('admin', 'Select Proper admin').notEmpty();
				req.assert('tenant', 'Select Proper tenant').notEmpty();
			}
			
			var errors = req.validationErrors();
			if (errors) {
				return res.status(400).send(errors);
			}

			var id = req.params.id;

			if(!id) {
				return res.status(400).send([{
					msg: 'ID required',
					param: 'id'
				}]);
			}

            Event.findOne({
                _id: id
            }).exec(function(err, event) {
                if(err) {
					if(err.kind == 'ObjectId') {
						return res.status(400).json([{
							msg: 'Event Not Found',
							param: 'id'
						}]);
					}
					return res.status(400).json([{
						msg: 'Internal error',
						param: null
					}]);
				}

				event.name = req.body.name;
				event.venue = req.body.venue;
				event.description = req.body.description;
				event.start = req.body.start;
				event.end = req.body.end;
				event.price = req.body.price;
				event.admin = req.body.admin;
				event.tenant = req.body.tenant;
				
				event.save(function(err) {
					if (err) {
						switch (err.code) {
							case 11000:
							case 11001:
								res.status(400).json([{
									msg: 'Username already taken',
									param: 'username'
								}]);
								break;
							default:
								var modelErrors = [];

								if (err.errors) {

									for (var x in err.errors) {
										modelErrors.push({
											param: x,
											msg: err.errors[x].message,
											value: err.errors[x].value
										});
									}

									res.status(400).json(modelErrors);
								}
						}
						return res.status(400);
					}
					return res.status(200).json({
						id: event.id
					});
				});
            });
        },

		/**
         * Delete user by id (Role based)
         */
		deleteSingle: function(req, res, next) {
			var current = req.body.current;

			if(!current || !current.id || !current.type || usersWithCreateAccess.indexOf(current.type) < 0) {
				res.status(400).json({
					msg: 'Uauthorized Access',
					param: null
				});
			}

			var id = req.params.id;

			if(!id) {
				return res.status(400).send([{
					msg: 'ID required',
					param: 'id'
				}]);
			}

            Event.remove({
                _id: id
            }).exec(function(err, user) {
                if(err) {
					if(err.kind == 'ObjectId') {
						return res.status(400).json([{
							msg: 'Event Not Found',
							param: 'id'
						}]);
					}
					return res.status(400).json([{
						msg: 'Internal error',
						param: null
					}]);
				}

				return res.status(200).json({
					ok: 1
				});
            });
		},

        /**
         * List of users
         */
        list: function(req, res, next) {
            
			var current = req.body.current;

			if(!current || !current.id || !current.type || usersWithCreateAccess.indexOf(current.type) < 0) {
				res.status(400).json({
					msg: 'Uauthorized Access',
					param: null
				});
			}

			var skip = req.body.skip || 0;
			var limit = req.body.limit || 10;

			var where = {};

			if(current.type == 'admin') {
				where.admin = current.id;
				where.tenant = current.tenant._id;
			} else if(current.type == 'tenant') {
				where.tenant = current.tenant._id;
			}

			Event.count(where, function(err, count) {

				if(err) {
					// return done(err);
					return res.status(400).json([{
						msg: err,
						param: null
					}]);
				}

				Event.find(where)
				.skip(skip)
				.limit(limit)
				.exec(function(err, list) {
					if(err) {
						return res.status(400).send([{
							msg: 'Error',
							param: null
						}])
					}

					return res.status(200).json({
						count: count,
						list: list
					});
				});
			});
        }
    };
}