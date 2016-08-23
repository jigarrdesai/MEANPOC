'use strict';

/*
 * Defining the Package
 */
var mean = require('meanio'),
  Module = mean.Module;

function SyxPurchaseClass () {
  Module.call(this, 'purchases');
  this.auth = null;
}

SyxPurchaseClass.prototype = Object.create(Module.prototype,{constructor:{
  value:SyxPurchaseClass,
  configurable: false,
  enumerable: false,
  writable: false
}});

var SyxPurchases = new SyxPurchaseClass();

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
SyxPurchases.register(function(app, users) {

    SyxPurchases.apiUrl = 'http://104.237.2.155:3020';
    SyxPurchases.pgApiUrl = 'http://104.237.2.155:3020/pg';
    SyxPurchases.routes(app, users);
    return SyxPurchases;
});
