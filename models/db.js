'use strict';
var Cradle = require('cradle');

var config = require('../config');
var internals = {};

if (process.env.NODE_ENV === 'development') {

  internals.db = new Cradle.Connection().database(config.couchDb.dbName);

} else {

  internals.db = new Cradle.Connection(
    config.couchDb.url,
    config.couchDb.port, {
      auth: {
        username: config.couchDb.username,
        password: config.couchDb.password
      }
    })
    .database(config.couchDb.dbName);
}
console.log(internals.db);
module.exports = internals.db;
