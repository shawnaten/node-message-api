const Bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');

// validate function for basic email-password auth
exports.validate = function(request, email, password, callback) {
  var savedUser;

  UserModel.findOne({ email: email }, findUser);

  function findUser(err, user) {
    savedUser = user;

    if (err || user === null || !user.verified) callback(err, false);
    else user.comparePassword(password, validate); 
  };

  function validate(err, isValid) {
    callback(err, isValid, { id: savedUser._id });
  };
};

exports.testHandler = function(request, reply) {
  return reply({ message: 'login success' });
};

