const Bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');
const BankUserModel = require('../models/BankUserModel');

// validate function for basic email-password auth
exports.validate = function(request, email, password, callback) {
    var bankUser;
    var user;

    BankUserModel.findOne({ email: email }, findBankUser);

    function findBankUser(err, result) {
        bankUser = result;

        if (err) callback(err, false);
        else if (bankUser === null) callback(err, false);
        else UserModel.findOne({ _bankId: bankUser._id }, findUser);
    };
    
    function findUser(err, result) {
        user = result;
        
        if (err) callback(err, false);
        else if (user === null) callback(err, false);
        else user.comparePassword(password, validate); 
    };

    function validate(err, isValid) {
        callback(err, isValid, { id: user._id });
    };
};

exports.testHandler = function(request, reply) {
    return reply('login auth success').header("Authorization", request.headers.authorization);
};

