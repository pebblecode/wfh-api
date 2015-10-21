'use strict';

const Employee = require('../models/employee');
const Boom = require('boom');

module.exports.getAll = function (request, reply) {
  
  Employee.getAll()
  .then((workers) => {

    reply(workers);

  })
  .catch((err) => {
    console.log(err);
    reply(Boom.badImplementation());
  });

};

module.exports.addNew = function(request, reply){

  var payload = request.payload;

  Employee.getByEmail(payload.email)
  .then(function(employee){
    if(employee){
      return reply(Boom.conflict());
    }

    return new Employee(request.payload)
    .save(payload)
    .then((worker) => {
      reply();
    });

  })
  .catch((err) => {
    console.log(err);
    reply(Boom.badImplementation());
  })

};

module.exports.updateStatus = function (request, reply){
  var payload = request.payload;

  if(!Employee.isValidStatus(payload.status)){
    return reply(Boom.badRequest('Not a valid status type'));
  }

  Employee.updateStatus(payload.email, payload.status)
  .then((employee) => {
    reply(employee);
  })
  .catch((err) => {
    console.log(err);
    reply(Boom.badImplementation());
  });
};


/* 

/get all workes


  /workers
  get all workers with email, details, statuses

  post /workers/{email} // temporary for local dev
  {
    status:wfo|wfh|sick|holiday
  }

  post /webhooks/wfo
  post /webhooks/wfslack

*/
