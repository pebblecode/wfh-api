'use strict';
const Boom = require('boom');

const config = require('../config');
const Employee = require('../models/employee');
const logEvent = require('../util/logEvent');
const Slack = require('../util/slack');
const commandMapper = require('../util/commandMapper');

const commands = require('../constants/commands');

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

function slackTokenMatch(token) {
  const tokens = config.slack.webhooks.requestTokens;
  const match = tokens.filter((t) => {
    return t === token;
  });

  return match.length > 0;
}

function getDefaultStatus(text) {
  const paramSplit = text.split('default:');

  if (paramSplit.length === 2 && !!commands[paramSplit[1]]) {
    return commandMapper(paramSplit[1]);
  } else {
    return '';
  }
}

module.exports.slackHook = function(request, reply) {
  console.log(request.payload);
  const payload = request.payload;
  const token = payload.token;

  if (!slackTokenMatch(token)) {
    return reply(Boom.badRequest('Bad Request Token'));
  }

  const status = commandMapper(payload.command.substr('1'));
  const defaultStatus = getDefaultStatus(payload.text);

  slack.getUserInfo(payload.user_id)
  .then((result) => {
    const profile = result.user.profile;

    return Employee.getByEmail(profile.email)
    .then((employee) => {

      if (!employee) {

        return new Employee({
          name: profile.realName,
          email: profile.email,
          status,
          defaultStatus:defaultStatus
        })
        .save();

      } else {

        return Employee.updateStatus(profile.email, status, defaultStatus);
      }
    })
    .then((employee) => {
      reply(`Updated status to ${employee.status}, your default status is: ${employee.defaultStatus}`);
      logEvent(employee);
    });

  })
  .catch((err) => {
    console.log(err);
    reply(Boom.badImplementation());
  });
};
