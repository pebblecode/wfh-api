'use strict';
const Analytics = require('analytics-node');
const config = require('../config');

module.exports = function(employee) {

  if (!config.segment || !config.segment.writeKey || !config.segment.writeKey.length) {
    return;
  }

  const analytics = new Analytics(config.segment.writeKey);
  analytics.identify({
    userId: employee.email,
    traits: {
      name: employee.name
    }
  });

  analytics.track({
    userId: employee.email,
    event: 'status',
    properties: {
      status: employee.status
    }
  });

};
