'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Purchase = mongoose.model('Purchase'),
	request = require('request');


var usersWithCreateAccess = ['super', 'tenant', 'admin'];

function hasCreateAccess(current, type) {
	return usersWithCreateAccess.indexOf(current) < usersWithCreateAccess.indexOf(type);
}

module.exports = function(SyxEvent) {
    return {
        list: function(req, res, next) {
            
			var current = req.body.current;

			if(!current || !current._id || !current.type || usersWithCreateAccess.indexOf(current.type) < 0) {
				return res.status(400).json({
					msg: 'Uauthorized Access',
					param: null
				});
			}

			var skip = req.body.skip || 0;
			var limit = req.body.limit || 10;

			var where = {};

			switch(current.type) {
				case 'super':
					where = {};
					break;
				case 'tenant':
					where.tenant = current._id;
					break;
				case 'admin':
					where.admin = current._id;
					break;
				default:
					break;
			}
			
			Purchase.count(where, function(err, count) {

				if(err) {
					// return done(err);
					return res.status(400).json([{
						msg: err,
						param: null
					}]);
				}

				Purchase.find(where)				
				.populate('user')
				.populate('admin')
				.populate('tenant')
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