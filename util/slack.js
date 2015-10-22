'use strict';

const request = require('request');
const keyMirror = require('keymirror');
const camelCase = require('camelcase-keys-recursive');

const commands = keyMirror({wfh:null, wfo:null, wfhtest:null});
var internals = {};

module.exports = internals.Slack = function(options) {
  this.token = options.token;
};

internals.Slack.prototype.getUserInfo = function(userId) {
  const url = `https://slack.com/api/users.info?token=${this.token}&user=${userId}`;
  return internals.getRequest(url);
};

internals.Slack.command = function(command) {
  command = command.substr(1);
  return commands(command);
};

internals.getRequest = function(url) {

  return new Promise((resolve, reject) => {

    request(url, function(err, httpResponse, body) {
      if (err) {
        return reject(err);
      }

      if (httpResponse.statusCode === 200) {
        return resolve(camelCase(JSON.parse(body)));
      }

      reject('Not OK Response');

    });

  });

};
