'use strict';
var getEnv = require('getenv');
var path = require('path');

module.exports = {
  port: getEnv.int('PORT', 3000),
  couchDb:{
    username: getEnv('COUCHDB_USERNAME', ''),
    password: getEnv('COUCHDB_PASSWORD', ''),
    url: getEnv('COUCHDB_URL', 'http://127.0.0.1'),
    port: getEnv.int('COUCHDB_PORT', 5984),
    dbName: getEnv('COUCHDB_NAME', 'wfh')
  },
  segment:{
    writeKey: getEnv('SEGMENT_IO_WRITE_KEY', ''),
  },
  slack:{
    token: getEnv('SLACK_TOKEN', ''),
    webhooks:{
      requestTokens: getEnv('SLACK_WEBHOOK_TOKENS', '').split(',')
    }
  },
  auth:{
    admin:{
      password: getEnv('ADMIN_PASSWORD', '$2a$10$oIeQ626Z5yIU7IsvC.1t2.JaegXE1Jn9FaLxF1SfA/jXgQNFah/Wu')
    }
  }
};
