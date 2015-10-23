'use strict';
const _ = require('lodash');
const db = require('./db');
const Base = require('./base');
const statuses = require('../constants/statuses');
const commandTypes = require('../constants/commandTypes');
var internals = {};

const TYPE = 'Employee';


module.exports = internals.Employee = function(options) {
  options = options || {};

  this.name = options.name;
  this.email = options.email;
  this.status = options.status; //use keymirror
  this.defaultStatus = options.defaultStatus || '(Not Set)';

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
    dateModified: new Date(),
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
            statusType: employee.status, // to be determined at run time.
            defaultStatus: employee.defaultStatus,
            isDefault: employee.status === employee.defaultStatus
          },
          message: employee.message
        };
      });
    });

};

internals.Employee.getByEmail = function(email) {
  return Base.view(`${TYPE}/byEmail`, email)
  .then((employee) => {
    if (employee) {
      return _.first(employee).value;
    } else {
      return null;
    }
  });
};

internals.Employee.isValidStatus = function(status) {
  return !!statuses[status];
};

internals.Employee.updateStatus = function(email, status, command) {
  return internals.Employee.getByEmail(email)
    .then((employee) => {

      if (employee) {

        var attr = {
          status: status,
          dateModified: new Date(),
          message: ''
        };


        if (command && !!commandTypes[command.commandType]) {
          if (command.commandType === commandTypes.default && internals.Employee.isValidStatus(command.value)) {
            attr.defaultStatus = command.value;
          }

          if (command.commandType === commandTypes.message) {
            attr.message = command.value;
          }
        }

        return internals.Employee.update(employee, attr);
        //also add new record for historical data.
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
