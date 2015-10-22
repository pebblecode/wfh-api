'use strict';
const Boom = require('boom');

const config = require('../config');
const Employee = require('../models/employee');
const logEvent = require('../util/logEvent');
const Slack = require('../util/slack');
const commandMapper = require('../util/commandMapper');

const slack = new Slack({token:config.slack.token});

module.exports.getAll = function(request, reply) {

  Employee.getAll()
  .then((workers) => {
    reply(workers);
  })
  .catch((err) => {
    console.log(err);
    reply(Boom.badImplementation());
  });

};

module.exports.addNew = function(request, reply) {

  var payload = request.payload;

  Employee.getByEmail(payload.email)
  .then((employee) => {
    if (employee) {
      return reply(Boom.conflict());
    }

    var employee = new Employee(payload)
    .save(payload)
    .then((worker) => {

      reply();

      if (worker) {
        logEvent(employee);
      }
    });

  })
  .catch((err) => {
    console.log(err);
    reply(Boom.badImplementation());
  });

};

module.exports.updateStatus = function(request, reply) {
  var payload = request.payload;

  if (!Employee.isValidStatus(payload.status)) {
    return reply(Boom.badRequest('Not a valid status type'));
  }

  Employee.updateStatus(payload.email, payload.status)
  .then((employee) => {
    if (!employee) {
      return reply(Boom.notFound('Email Address Not Found'));
    }

    reply(employee);

    logEvent(employee);

  })
  .catch((err) => {
    console.log(err);
    reply(Boom.badImplementation());
  });
};

module.exports.slackHook = function(request, reply) {
  console.log(request.payload);
  var payload = request.payload;

  if (request.payload.token !== config.slack.webhooks.requestToken) {
    return reply(Boom.badRequest('Bad Request Token'));
  }

  const status = commandMapper(payload.command);

  slack.getUserInfo(payload.user_id)
  .then((result) => {
    const user = result.user;
    const profile = user.profile;

    return Employee.getByEmail(profile.email)
    .then((employee) => {
      if (!employee) {
        return new Employee({name: profile.realName, email:profile.email, status})
        .save();
      } else {
        return Employee.updateStatus(profile.email, status);
      }
    })
    .then((employee) => {
      reply(`Updated status to ${employee.status}`);
      logEvent(employee);
    });
  })
  .catch((err) => {
    console.log(err);
    reply(Boom.badImplementation());
  });
};
