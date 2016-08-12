'use strict';

var config = require('meanio').loadConfig();

module.exports = function(SyxEvents, app) {

	// User routes use events controller
  	var events = require('../controllers/events')(SyxEvents);

  	// app.use(events.loadUser);

  	app.route('/api/event/single/:id').get(events.single); // Everyone can access

  	app.route('/api/event/deleteSingle/:id').delete(events.deleteSingle); // Requires Roles
  	app.route('/api/event/updateSingle/:id').post(events.updateSingle); // Requires Role

  	app.route('/api/event/list').post(events.list); // Requires Roles
	app.route('/api/event/create').post(events.create); // Requires Roles
};
