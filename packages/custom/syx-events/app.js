'use strict';

/*
 * Defining the Package
 */
var mean = require('meanio'),
  Module = mean.Module;

function SyxEventClass () {
  Module.call(this, 'events');
  this.auth = null;
}

SyxEventClass.prototype = Object.create(Module.prototype,{constructor:{
  value:SyxEventClass,
  configurable: false,
  enumerable: false,
  writable: false
}});

var SyxEvents = new SyxEventClass();

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
SyxEvents.register(function(app, users) {
    SyxEvents.routes(app, users);
    return SyxEvents;
});
