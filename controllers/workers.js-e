'use strict';

const Worker = require('../models/worker');
const Boom = require('boom');

module.exports.getAll = function (request, reply) {
  
  Worker.getAll()
  .then((workers) => {

    reply(workers);

  })
  .catch((err) => {
    console.log(err);
    reply(Boom.badImplementation());
  });

};
