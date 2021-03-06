var model = module.exports,
    crypto = require('crypto'),
    ih = require('insanehash'),
    moment = require('moment'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _clientId = 'DefiDBWeb';

var OAuthUsersModel = mongoose.model('OAuthUsers');
var OAuthAccessTokensModel = mongoose.model('OAuthAccessTokens');

/**
 * Returns user by username in callback
 */
function getUser(username, email, callback) {
    var query = { $or: [{ username: username }, { email: email }] };
    OAuthUsersModel.find().or([{ username: username }, { email: email }]).exec(callback);
}
model.getUser = getUser;
/**
 * Saves user in database
 */
function saveUser(user, callback) {
    if (user.password !== user.confirmpassword) {
        return callback({ code: 107, msg: 'Password mismatch', error: null }, null);
    }
    model.getUser(user.username, user.email, function (err, found) {
        if (err) {
            callback({ code: 100, msg: 'Error at getUser', error: err }, null);
        }
        if (found.length > 0) {
            var emailTaken = user.email === found[0].email;
            var usernameTaken = user.username === found[0].username;
            var msg = emailTaken ? { code: 102, msg: 'Email already in use.', error: err } : { code: 101, msg: 'User already exists', error: err };
            callback(msg, null);
        }
        else {
            var password = ih.keccak(user.password);
            var model = new OAuthUsersModel({
                username: user.username,
                firstname: user.firstName,
                lastname: user.lastName,
                displayname: user.displayName,
                email: user.email,
                active: false,
                canBeContacted: user.canBeContacted,
                isVisible: false,
                password: password
            });
            model.save(callback);
        }
    });
}
model.saveUser = saveUser;
/**
 * Validates token
 */
function validateToken(token, callback) {
    OAuthAccessTokensModel.findOne({ accessToken: token, clientId: _clientId }, function (err, result) {
        if (!err && result) {
            if (moment(result.expires).isAfter(moment())) {
                callback(null, result);
            }
        }
        else { callback(); }
    });
}
model.validateToken = validateToken;
/**
 * Validates username and password
 */
function validate(username, password, callback) {
    var passwordHash = ih.keccak(password);
    getUserByUsernamePassword(username, passwordHash, callback);
}
/**
 * Fetches user by username and password
 */
function getUserByUsernamePassword(username, passwordHash, callback) {
    OAuthUsersModel.findOne({ username: username, password: passwordHash },
        function (err, result) {
            if (err || !result) {
                callback({ code: 104, msg: 'invalid credentials' }, null);
            }
            else {
                generateToken(username, function (err, token) {
                    if (err) {
                        callback({ code: 105, msg: 'error generating token', error: err }, null);
                    }
                    else {
                        var expires = moment().add(365, 'day');
                        storeToken(username, token, expires,
                            function (err, result) {
                                if (err) {
                                    callback({ code: 106, msg: 'couldn\'t store token', error: err }, null);
                                }
                                else {
                                    callback(null, { token: token, expires: expires });
                                }
                            });
                    }
                });
            }
        });
}
/**
 * Generate token for username
 */
function generateToken(username, callback) {
    crypto.randomBytes(256, function (ex, buffer) {
        if (ex) { callback(ex); }
        var token = crypto
            .createHash('sha1')
            .update(buffer)
            .digest('hex');
        callback(null, { username: username, token: token });
    });
}
model.generateToken = generateToken;
/**
 * Stores token in database
 */
function storeToken(username, token, expires, callback) {
    var tokenModel = new OAuthAccessTokensModel({ accessToken: token.token, clientId: _clientId, userId: username, expires: expires });
    tokenModel.save(callback);
}
model.validate = validate;
/**
 * Signs out user from token database
 */
function signout(accessToken, callback) {
    model.validateToken(accessToken, function (err, result) {
        if (result) { OAuthAccessTokensModel.remove({ accessToken: accessToken }, function (err, result) { callback(err, result); }); }
        else if (err) { callback({ code: 107, msg: 'token not found', error: err }, null); }
        else { callback(null, null); }
    });
}
model.signout = signout;