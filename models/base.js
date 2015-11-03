'use strict';

var config = require('../config');

var _ = require('lodash');
var Uuid = require('node-uuid');
var db = require('./db');

var internals = {};

module.exports = internals.Base = function(attr) {
  this.attr = attr;
  this.id = attr.id || Uuid.v4();
};

internals.Base.prototype.save = function() {
  var _this = this;

  var promise = new Promise(function(resolve, reject) {

    db.save(_this.id, _this.toJSON(), function(err, res) {
      if (err) {
        return internals.errorHandler(reject, err);
      }

      resolve(_.extend(res, _this.toJSON()));
    });

  });

  return promise;

};

internals.Base.update = function(model, attr) {

  const id = model.id || model._id;
  delete model.id;

  return new Promise(function(resolve, reject) {

    db.merge(id, attr, function(err, res) {
      if (err) {
        return internals.errorHandler(reject, err);
      }

      resolve(_.extend(model, attr));
    });

  });
};

internals.Base.delete = function(id) {
  return new Promise(function(resolve, reject) {
    db.remove(id, function(err, res) {
      if (err) {
        return reject(err);
      }
      resolve(res);
    });
  });
};

internals.errorHandler = function(reject, err) {
  if (err.error === 'not_found') {
    reject({
      notFound: true
    });
  } else {
    reject(err);
  }
};

internals.Base.get = function(id) {
  var Model = this;
  return new Promise(function(resolve, reject) {

    db.get(id, {
      cacheEnabled: false
    }, function(err, res) {
      if (err) {
        return internals.errorHandler(reject, err);
      }

      resolve(new Model(res));
    });

  });

};

internals.Base.view = function(view, key) {
  var options;

  if (key) {
    options = {key};
  }

  return new Promise(function(resolve, reject) {
    db.view(view, options, function(err, doc) {
      if (err) {
        return reject(err);
      }

      doc = doc.length ? doc : null;

      resolve(doc);
    });
  });
};
