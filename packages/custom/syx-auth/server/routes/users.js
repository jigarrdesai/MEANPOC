'use strict';

var config = require('meanio').loadConfig();

module.exports = function(SyxAuth, app, auth, database, passport) {

	// User routes use users controller
  	var users = require('../controllers/users')(SyxAuth);

  	// app.use(users.loadUser);

  	app.route('/api/user/me').post(users.me); // Requires Role

  	app.route('/api/user/single/:id').get(users.single); // Everyone can access

  	app.route('/api/user/deleteSingle/:id').delete(users.deleteSingle); // Requires Roles
  	app.route('/api/user/updateSingle/:id').post(users.updateSingle); // Requires Role

  	app.route('/api/user/list').post(users.list); // Requires Roles
  	app.route('/api/user/listAdmin').post(users.list); // Requires Roles
  	app.route('/api/user/listTenant').post(users.list); // Requires Roles

	app.route('/api/user/create').post(users.create); // Requires Roles
	
  	// if(config.strategies.local.enabled) {
		
		// app.route('/api/forgot-password')
		//   .post(users.forgotpassword);

		// app.route('/api/reset/:token')
		//   .post(users.resetpassword);

		// Setting the local strategy route
		app.route('/api/user/login').post(users.login);
		app.route('/api/user/registerSuper').post(users.createSuper);
  	// }
};
