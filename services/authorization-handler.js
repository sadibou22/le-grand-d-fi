var moment = require('moment'),
    mongoose = require('mongoose'),
    OAuthAccessTokensModel = mongoose.model('OAuthAccessTokens');
var _clientId = 'DefiDBWeb';

module.exports = function authorization() {
    /**
     * Sends rejection response
     */
    function reject(req, res) {
        return res.redirect('/signin?returnUrl=' + encodeURIComponent(req.url) + '');
    }
    /**
     * Authorizes access
     */
    return function check(req, res, next) {
        if (!req.cookies) { return reject(req, res); }

        var token = req.cookies['access_token'];
        var expires = moment(req.cookies['expires']);

        if (!expires.isValid() || expires.isBefore(moment())) { return reject(req, res); }

        if (token && expires) {
            OAuthAccessTokensModel.findOne({ accessToken: token, clientId: _clientId }, function(err, result) {
                if (!err && result) {
                    return next();
                }
                return reject(req, res);
            });
        }
    };
};