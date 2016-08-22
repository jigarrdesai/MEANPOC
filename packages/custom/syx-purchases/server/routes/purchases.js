'use strict';

var config = require('meanio').loadConfig();

module.exports = function(SyxPurchases, app) {

	// User routes use purchases controller
  	var purchases = require('../controllers/purchases')(SyxPurchases);

  	// app.route('/api/purchase/single/:id').get(purchases.single); // Everyone can access

  	// app.route('/api/purchase/deleteSingle/:id').delete(purchases.deleteSingle); // Requires Roles

  	app.route('/api/purchase/list').post(purchases.list); // Requires Roles
};
