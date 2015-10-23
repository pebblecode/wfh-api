'use strict';
const keyMirror = require('keymirror');

//uppercase to match usage on client and email sender.
module.exports = keyMirror({
  InOffice: null,
  OutOfOffice: null,
  Sick: null,
  Holiday: null
});
