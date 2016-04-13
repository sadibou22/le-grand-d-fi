var model = module.exports;
var mongoose = require('mongoose'),
    moment = require('moment'),
    OAuthAccessTokensModel = mongoose.model('OAuthAccessTokens');
var _clientId = 'DefiDBWeb';
/**
 * Sets user in request 
 */
function setUser(req, res, next) {
    if (!req.cookies) { return next(); }
    var token = req.cookies['access_token'];
    var expires = moment(req.cookies['expires']);
    if (token && expires) {
        OAuthAccessTokensModel.findOne({ accessToken: token, clientId: _clientId }, function(err, result) {
            if (!err && result) {
                req.username = result.userId;
                req.accessToken = token;
            }
        });
    }
    next();
};
model.setUser = setUser;

/**
 * Authorizes access
 */
function authorize(req, res, next) {
    if (!req.cookies) { return reject(req, res); }
    
    var token = req.cookies['access_token'];
    var expires = moment(req.cookies['expires']);
    
    if (expires.isBefore(moment())) { return reject(req, res); }
    
    if (token && expires) {
        OAuthAccessTokensModel.findOne({ accessToken: token, clientId: _clientId }, function(err, result) {
            if (!err && result) {
                return next();
            }
            return reject(req, res);
        });
    }
}
/**
 * Sends rejection response
 */
function reject(req, res) {
    return res.redirect('/signin?returnUrl=' + encodeURI(req.url) + '');
}
model.authorize = authorize;