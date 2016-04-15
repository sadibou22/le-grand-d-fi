var model = module.exports,
    ih = require('insanehash'),
    moment = require('moment'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    userService = require('./user-service');

var PasswordResetSchema = new Schema({
    userId: { type: String, index: true },
    code: { type: String, index: true },
    expires: { type: Date }
});
mongoose.model('PasswordResets', PasswordResetSchema);
var PasswordResetsModel = mongoose.model('PasswordResets');

function changePassword(user, callback) {
    if (user.password !== user.confirmpassword) {
        return callback({ code: 107, msg: 'Password mismatch', error: null }, null);
    }
    var query = { userId: user.username, code: user.code, expires: { $gt: new Date() } };
    PasswordResetsModel.find(query, function (err, result) {
        if (err || !result || result.length === 0) {
            return callback({ code: 200, msg: 'Reset code not found', error: err }, null);
        }
        var resetCode = result[0];
        userService.getUser(user.username, null, function (err, result) {
            if (result && result.length === 1) {
                var found = result[0];
                var passwordHash = ih.keccak(user.password);
                found.password = passwordHash;
                PasswordResetsModel.remove(resetCode, function (err, result) {
                    if (!err) {
                        found.save(callback);
                    }
                    else { callback({ code: 205, msg: 'Reset code not deleted', error: err }); }
                });
            }
            else if (!result || result.length === 0) {
                return callback({ code: 201, msg: 'User not found', error: err }, null);
            }
            else if (err) {
                return callback({ code: 202, msg: 'Reset error', error: err }, null);
            }
            else {
                return callback({ code: 203, msg: 'Unknown error', error: err }, null);
            }
        });
    });
}
model.changePassword = changePassword;
/**
 * Generate a reset code and send to user
 */
function generateResetCode(username, callback) {
    userService.getUser(username, null, function (err, result) {
        if (result.length === 1) {
            userService.generateToken(username, function (err, result) {
                if (result) {
                    var expires = moment().add(1, 'hour');
                    var codeObj = { userId: username, code: result.token, expires: expires };
                    var resetRequest = new PasswordResetsModel(codeObj);
                    resetRequest.save(function (err, result) {
                        callback(err, codeObj);
                    });
                }
                else { return callback({ code: 204, msg: 'No token generated', error: err }); }
            });
        }
        else
        {
            callback(null, { username: username });
        }
    });
}
model.generateResetCode = generateResetCode;

