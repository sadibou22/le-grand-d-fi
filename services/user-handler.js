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
            next();
        });
    }
    else { return next(); }
}
model.setUser = setUser;

