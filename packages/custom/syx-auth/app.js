'use strict';

/*
 * Defining the Package
 */
var mean = require('meanio'),
  Module = mean.Module;

function SyxAuthClass () {
  Module.call(this, 'users');
  this.auth = null;
}

SyxAuthClass.prototype = Object.create(Module.prototype,{constructor:{
  value:SyxAuthClass,
  configurable: false,
  enumerable: false,
  writable: false
}});

var SyxAuth = new SyxAuthClass();

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
SyxAuth.register(function(app, database, passport) {

    SyxAuth.apiUrl = 'http://37.247.116.155:8000/api';
   // SyxAuth.userHost = '104.237.2.155:3019';
    //SyxAuth.proxyUrl = 'http://37.247.116.155:8000';
    SyxAuth.auth = require('./authorization');
    require('./passport')(passport);

    mean.register('auth', SyxAuth.auth);

    //We enable routing. By default the Package Object is passed to the routes
    SyxAuth.routes(app, SyxAuth.auth, database, passport);

    SyxAuth.angularDependencies(['angular-jwt']);

    SyxAuth.events.defaultData({
        type: 'user'
    });

    return SyxAuth;
});
