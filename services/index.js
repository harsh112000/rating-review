const HealthCheck = require('./health-check');
const Sample = require('./sample');
const User = require('./user/user');
const Admin = require('./user/admin/authentication');
const Questions = require('./questions/questions');
const Customer = require('./user/customer/authentication');

module.exports = {
  HealthCheck,
  Sample,
  User,
  Questions,
  Admin,
  Customer,
};
