'use strict';
var workers = require('./controllers/workers');

module.exports = [
  
  {
    path:'/',
    method:'GET',
    handler: function(request, reply){
      reply('OK')
    },
  },

  {
    path: '/workers',
    method: 'GET',
    handler: workers.getAll
  }
  
];
