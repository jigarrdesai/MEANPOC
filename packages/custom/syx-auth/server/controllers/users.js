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

module.exports = function(MeanUser) {
    return {
        login: function(req, res) {

            // req.assert('name', 'You must enter a name').notEmpty();
            req.assert('email', 'You must enter a valid email address').isEmail();
            req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
            // req.assert('username', 'Username cannot be more than 20 characters').len(1, 20);
            // req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

            var errors = req.validationErrors();
            if (errors) {
                return res.status(400).send(errors);
            }

			var email = req.body.email;
			var password = req.body.password;

			User.findOne({
				email: email
			}, function (err, user) {
				if(err) {
					// return done(err);
					return res.status(400).json([{
						msg: err,
						param: null
					}]);
				}
				if (!user) {
					return res.status(400).json([{
						msg: 'Unknown Email',
						param: 'email'
					}]);
				}
				
				if(!user.authenticate(password)) {
					return res.status(400).json([{
						msg: 'Invalid Password',
						param: 'password'
					}]);
				}
				
				var payload = user;
                payload.redirect = req.body.redirect;
                var escaped = JSON.stringify(payload);
                escaped = encodeURI(escaped);
				var token = jwt.sign(escaped, config.secret);

				res.status(200).json({
					user: {
						token: token,
						id: user.id,
						type: user.type,
						parent: user.parent
					}
				});
			});
        },

        /**
         * Create user
         */
        create: function(req, res, next) {

			var current = req.body.current;

			if(!current.id || !current.type || usersWithCreateAccess.indexOf(current.type) < 0) {
				res.status(400).json({
					msg: 'Uauthorized Access',
					param: null
				});
			}

            var user = new User(req.body);

			// because we set our user.provider to local our models/user.js validation will always be true
			req.assert('name', 'You must enter a name').notEmpty();
			req.assert('email', 'You must enter a valid email address').isEmail();
			req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
			req.assert('username', 'Username cannot be more than 20 characters').len(1, 20);
			req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
			req.assert('type', 'Type can not be blank').notEmpty();

			var errors = req.validationErrors();
			if (errors) {
				return res.status(400).send(errors);
			} else if(!hasCreateAccess(current.type, req.body.type)) {
				return res.status(400).send({
					msg: 'Uauthorized Access',
					param: null
				});
			}

			user.parent = current.id;
			user.save(function(err) {
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

				var payload = user;
				payload.redirect = req.body.redirect;
				var escaped = JSON.stringify(payload);
				escaped = encodeURI(escaped);

				var token = jwt.sign(escaped, config.secret);
				return res.status(200).json({
					token: token,
					id: user.id,
					role: user.role
				});
			});
        },

		 /**
         * Create Super user
         */
		createSuper: function(req, res) {
			User.count({}, function(err, count) {

				if(err) {
					// return done(err);
					return res.status(400).json([{
						msg: err,
						param: null
					}]);
				}

				if(count == 0) {
					var user = new User(req.body);

					user.type = 'super';

					// because we set our user.provider to local our models/user.js validation will always be true
					req.assert('name', 'You must enter a name').notEmpty();
					req.assert('email', 'You must enter a valid email address').isEmail();
					req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
					req.assert('username', 'Username cannot be more than 20 characters').len(1, 20);
					req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

					var errors = req.validationErrors();
					if (errors) {
						return res.status(400).send(errors);
					}

					user.save(function(err) {
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

						var payload = user;
						payload.redirect = req.body.redirect;
						var escaped = JSON.stringify(payload);
						escaped = encodeURI(escaped);

						var token = jwt.sign(escaped, config.secret);
						return res.status(200).json({
							token: token,
							id: user.id,
							role: user.role
						});
					});
				} else {
					return res.status(400).json([{
						msg: 'Unauthorized Access',
						param: null
					}]);
				}
			});
		},

        /**
         * Send Current User (For future purpose)
         */
        me: function(req, res) {

			// because we set our user.provider to local our models/user.js validation will always be true
			req.assert('id', 'You must enter id').notEmpty();
			req.assert('token', 'You must enter a valid token').notEmpty();

			var errors = req.validationErrors();
			if (errors) {
				return res.status(400).send(errors);
			}

			var id = req.body.id;

            User.findOne({
                _id: id
            })
			.populate('parent')
			.exec(function(err, user) {
                if(err) {
					return res.status(400).json([{
						msg: 'Unauthorized Access',
						param: null
					}]);
				}

				return res.status(200).json({
					user: user.toJSON()
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

            User.findOne({
                _id: id
            })
			.populate('tenant')
			.populate('admin')
			.exec(function(err, user) {
                if(err) {
					if(err.kind == 'ObjectId') {
						return res.status(400).json([{
							msg: 'User Not Found',
							param: 'id'
						}]);
					}
					return res.status(400).json([{
						msg: 'Internal error',
						param: null
					}]);
				}

				return res.status(200).json({
					user: user.toJSON()
				});
            });
        },

		/**
         * Update user by id (Role based)
         */
		updateSingle: function(req, res, next) {

			var current = req.body.current;

			if(!current.id || !current.type || usersWithCreateAccess.indexOf(current.type) < 0) {
				res.status(400).json({
					msg: 'Uauthorized Access',
					param: null
				});
			}

			// because we set our user.provider to local our models/user.js validation will always be true
			req.assert('name', 'You must enter a name').notEmpty();
			req.assert('email', 'You must enter a valid email address').isEmail();
			// req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
			req.assert('username', 'Username cannot be more than 20 characters').len(1, 20);
			// req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

			var errors = req.validationErrors();
			if (errors) {
				return res.status(400).send(errors);
			} else if(!hasCreateAccess(current.type, req.body.type)) {
				return res.status(400).send({
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

            User.findOne({
                _id: id
            }).exec(function(err, user) {
                if(err) {
					if(err.kind == 'ObjectId') {
						return res.status(400).json([{
							msg: 'User Not Found',
							param: 'id'
						}]);
					}
					return res.status(400).json([{
						msg: 'Internal error',
						param: null
					}]);
				}

				user.name = req.body.name;
				user.username = req.body.username;
				// user.password = req.body.password;
				user.email = req.body.email;

				user.save(function(err) {
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
						id: user.id,
						role: user.role
					});
				});
            });
        },

		/**
         * Delete user by id (Role based)
         */
		deleteSingle: function(req, res, next) {
			var current = req.body.current;

			if(!current.id || !current.type || usersWithCreateAccess.indexOf(current.type) < 0) {
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

            User.remove({
                _id: id
            }).exec(function(err, user) {
                if(err) {
					if(err.kind == 'ObjectId') {
						return res.status(400).json([{
							msg: 'User Not Found',
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

			if(!current.id || !current.type || usersWithCreateAccess.indexOf(current.type) < 0) {
				res.status(400).json({
					msg: 'Uauthorized Access',
					param: null
				});
			}

			var skip = req.body.skip || 0;
			var limit = req.body.limit || 10;

			var where = {
				_id: {
					$ne: current.id
				}
			};

			if(current.type == 'admin') {
				where.admin = current.id;
				where.tenant = current.tenant._id;
			} else if(current.type == 'tenant') {
				where.tenant = current.id;
			}

			User.count(where, function(err, count) {

				if(err) {
					// return done(err);
					return res.status(400).json([{
						msg: err,
						param: null
					}]);
				}

				User.find(where)
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