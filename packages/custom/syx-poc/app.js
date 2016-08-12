'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var MeanStarter = new Module('meanStarter');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
MeanStarter.register(function(app, auth, database, users, system) {

  // MeanStarter.aggregateAsset('js','ngStorage.js');

  // Set views path, template engine and default layout
  app.set('views', __dirname + '/server/views');

  MeanStarter.routes(app, auth, database);

  MeanStarter.angularDependencies(['mean.system', 'ngStorage']);

  return MeanStarter;
});
