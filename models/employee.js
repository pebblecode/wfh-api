'use strict';
const _ = require('lodash');
const db = require('./db');
const Base = require('./base');
const statuses = require('../constants/statuses');
var internals = {};

const TYPE = 'Employee';


module.exports = internals.Employee = function(options) {
  options = options || {};

  this.name = options.name;
  this.email = options.email;
  this.status = options.status; //use keymirror
  this.defaultStatus = options.defaultStatus;

  Base.call(this, options);
};

_.extend(internals.Employee, Base);
_.extend(internals.Employee.prototype, Base.prototype);

internals.Employee.prototype.toJSON = function() {
  return {
    name: this.name,
    email: this.email,
    status: this.status,
    defaultStatus: this.defaultStatus,
    type: TYPE
  };
};

internals.Employee.getAll = function() {
  return Base.view(`${TYPE}/all`)
    .then((employees) => {
      if (!employees) {
        return [];
      }

      return employees.map((employee) => {
        return {
          name: employee.name,
          email: employee.email,
          status: {
            statusType: employee.status
          },
          isDefault:true
        };
      });
    });

};

internals.Employee.getByEmail = function(email) {
  return Base.view(`${TYPE}/byEmail`, email);
};

internals.Employee.isValidStatus = function(status) {
  return !!statuses[status];
};

internals.Employee.updateStatus = function(email, status, defaultStatus) {
  return internals.Employee.getByEmail(email)
    .then((result) => {

      if (result && Array.isArray(result)) {
        let employee = _.first(result);
        //also add new record for historical data.

        var attr = {
          status: status,
          dateModified: new Date()
        };

        if (internals.Employee.isValidStatus(defaultStatus)) {
          attr.defaultStatus = defaultStatus;
        }

        return internals.Employee.update(employee, attr);
      }

      return null;
    });

};

db.save('_design/' + TYPE, {
  all: {
    map: function(doc) {
      if (doc.type === 'Employee') {
        emit(doc.id, doc);
      }
    }
  },
  byEmail: {
    map: function(doc) {
      if (doc.type === 'Employee') {
        emit(doc.email, doc);
      }
    }
  },
  byStatus: {
    map: function(doc) {
      if (doc.type === 'Employee') {
        emit(doc.status, doc);
      }
    }
  },
  byName: {
    map: function(doc) {
      if (doc.type === 'Employee') {
        emit(doc.name, doc);
      }
    }
  }
});
