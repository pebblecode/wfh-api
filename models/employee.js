'use strict';
const keyMirror = require('keymirror');
const _ = require('lodash');


const db = require('./db');
const Base = require('./base');
var internals = {};

const TYPE = 'Employee';

//uppercase to match usage on client and email sender.
const statuses = keyMirror({
  InOffice: null,
  OutOfOffice: null,
  Sick: null,
  Holiday: null
});

module.exports = internals.Employee = function(options) {
  options = options || {};

  this.name = options.name;
  this.email = options.email;
  this.status = options.status; //use keymirror

  Base.call(this, options);
};

_.extend(internals.Employee, Base);
_.extend(internals.Employee.prototype, Base.prototype);

internals.Employee.prototype.toJSON = function() {
  return {
    name: this.name,
    email: this.email,
    status: this.status,
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
        return employee;
      });
    });

};

internals.Employee.getByEmail = function(email) {
  return Base.view(`${TYPE}/byEmail`, email);
};

internals.Employee.isValidStatus = function(status) {
  return !!statuses[status];
};

internals.Employee.updateStatus = function(email, status) {
  return internals.Employee.getByEmail(email)
    .then((employee) => {

      if (employee && Array.isArray(employee)) {
        employee = _.first(employee);
        return internals.Employee.update(employee, {
          status: status,
          dateModified: new Date()
        });
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
