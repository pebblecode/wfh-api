'use strict';

const Bcrypt = require('bcrypt');
const config = require('./config');

const users = {
  admin:{
    username: 'admin',
    password: config.auth.admin.password,
    name: 'Admin',
    id: 1
  }
};

module.exports = function(request, username, password, callback) {
  var user = users[username];

  if (!user) {
    return callback(null, false);
  }

  Bcrypt.compare(password, user.password, (err, isValid) => {
    callback(err, isValid, {id: user.id, name: user.name});
  });
};
