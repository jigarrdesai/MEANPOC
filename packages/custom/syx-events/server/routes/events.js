'use strict';

var config = require('meanio').loadConfig();

module.exports = function(SyxEvents, app) {

	// User routes use events controller
  	var events = require('../controllers/events')(SyxEvents);

  	// app.use(events.loadUser);

  	app.route('/api/event/single/:id').get(events.common); // Everyone can access

  	app.route('/api/event/deleteSingle/:id').delete(events.common); // Requires Roles
  	app.route('/api/event/updateSingle/:id').post(events.common); // Requires Role

  	app.route('/api/event/list').post(events.common); // Requires Roles
	app.route('/api/event/create').post(events.common); // Requires Roles
};
