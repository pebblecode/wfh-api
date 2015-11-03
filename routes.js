'use strict';
const Joi = require('joi');
const employee = require('./controllers/employee');

module.exports = [
  {
    path:'/',
    method:'GET',
    handler: function(request, reply) {
      reply('OK');
    },
  },

  {
    path: '/workers',
    method: 'GET',
    handler: employee.getAll
  },

  {
    path: '/workers',
    method: 'POST',
    handler: employee.addNew,
    config:{
      validate:{
        payload:{
          name: Joi.string().min(1),
          email: Joi.string().email(),
          status: Joi.string().min(4)
        }
      },
      auth: 'simple'
    }
  },

  {
    path: '/workers',
    method: 'PUT',
    handler: employee.updateStatus,
    config: {
      validate:{
        payload:{
          email: Joi.string().email(),
          status: Joi.string().min(4)
        }
      }
    }
  },

  {
    path:'/webhooks/slack',
    method:'POST',
    handler: employee.slackHook,
  }
];
