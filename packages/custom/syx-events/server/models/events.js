'use strict';

/**
 * Module dependencies.
 */
var mongoose  = require('mongoose'),
  Schema    = mongoose.Schema,
  crypto    = require('crypto'),
  _   = require('lodash');

/**
 * Validations
 */
var validatePresenceOf = function(value) {
  // If you are authenticating by any of the oauth strategies, don't validate.
  return (this.provider && this.provider !== 'local') || (value && value.length);
};

/**
 * Getter
 */
var escapeProperty = function(value) {
  return _.escape(value);
};

/**
 * Event Schema
 */

var EventSchema = new Schema({
  name: {
    type: String,
    required: true,
    get: escapeProperty
  },
  venue: {
    type: String,
    unique: true,
    required: false,
    get: escapeProperty
  },
  description: {
    type: String,
    required: true,
    default: 'user'
  },
  tenant: {
    type: Schema.Types.ObjectId,
    required: false,
    default: null,
    ref: 'User'
  },
  admin: {
    type: Schema.Types.ObjectId,
    required: false,
    default: null,
    ref: 'User'
  },
  start: {
    type: Date,
    required: true,
    default: Date.now
  },
  end: {
    type: Date,
    required: true,
    default: Date.now
  },
  price: {
    type: Number,
    required: true,
    get: escapeProperty
  }
});

/**
 * Hide security sensitive fields
 *
 * @returns {*|Array|Binary|Object}
 */
EventSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.hashed_password;
  delete obj.salt;
  return obj;
};

mongoose.model('Event', EventSchema);
