'use strict';
const keyMirror = require('keymirror');
const commands = keyMirror({
  wfh: null,
  wfo: null,
  wfhtest: null
});

module.exports = function(command) {
  command = command.substr(1);
  switch (command) {
  case commands.wfh:
    return 'OutOfOffice';
  case commands.wfo:
    return 'InOffice';
  default:
    return 'InOffice';
  }

};
