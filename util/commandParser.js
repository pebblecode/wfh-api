'use strict';
const commands = require('../constants/commands');
const commandTypes = require('../constants/commandTypes');
const commandMapper = require('./commandMapper');

function getDefaultStatus(command) {
  let c =  commandParser(commandTypes.default, command);

  if (c) {
    c.value = commandMapper(c.value);
  }

  return c;
}

function commandParser(commandType, command) {
  let paramSplit = command.split(`${commandType}:`);

  if (paramSplit.length === 2) {
    return {commandType: commandType, value: paramSplit[1]};
  } else {
    return null;
  }
}

function getMessage(command) {
  return commandParser(commandTypes.message, command);
}

module.exports = function(command) {
  let c = getDefaultStatus(command);

  if (c) {
    return c;
  }

  return getMessage(command);

};
