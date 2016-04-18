// Class for a user in our messaging service.
// Outlines DB schema and handles common functions for APIUser objects.

const SALT_WORK_FACTOR = 10;

const Bcrypt = require('bcrypt');
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const DBConnection = require('./DBConnection');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    _bankId: { type: Schema.Types.ObjectId, required: true },
    password: { type: String, required: true },
    tokens: [ { deviceName: String, jti: String } ],
    verified: { type: Boolean, default: false, required: true },
});

UserSchema.pre('save', function(next) {
    //console.log('pre save');
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    //console.log('before hash');
    bcrypt.hash(user.password, SALT_WORK_FACTOR, function(err, hash) {
        //console.log(err);
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

const model = DBConnection.model('User', UserSchema);

model.MockDB = [
{
    email: 'john@domain.com',
        // 'secret'
        password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm',
        name: 'John Doe',
        tokens: [
        {
            device_name: 'Nexus 5x',
            jit: '90dd2cdf-a6f3-4643-8a1f-c52544b1c6a6'
        }
    ]
}
];

module.exports = model;
