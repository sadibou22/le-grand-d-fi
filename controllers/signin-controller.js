var model = module.exports;
var userService = require('../services/user-service.js'),
    moment = require('moment');

var _viewName = 'signin',
    _redirectViewName = 'oauthRedirect';

model.index = function(req, res, next) {
    var vm = {
        viewName: _viewName,
        isSignedIn: (req.username),
        isSignedOut: !(req.username),
        csrfToken: req.csrfToken(),
        username: req.query.username
    };
    res.render(_viewName, vm);
};
model.validate = function(req, res, next) {
    var vm = {
        viewName: _viewName,
        isSignedIn: (req.username),
        isSignedOut: !(req.username),
        csrfToken: req.csrfToken(),
        username: req.body.username
    };
    userService.validate(req.body.username, req.body.password, function(err, result) {
        if (!err) {
            res.redirect('/oauthredirect?token=' + result.token.token + '&expires=' + (moment(result.expires).toString()));
        }
        else {
            vm.invalidLogin = true;
            vm.error = { code: 104, msg: 'Invalid login' };
            res.render(_viewName, vm);
        }
    });
};
model.oauthRedirect = function(req, res, next) {
    var vm = {
        token: req.query.token,
        expires: req.query.expires,
        viewName: _viewName,
        isSignedIn: (req.username),
        isSignedOut: !(req.username)
    };
    userService.validateToken(vm.token, function(err, result) {
        if (!err && result) {
            res.cookie('access_token', result.accessToken, { maxAge: 900000, httpOnly: true });
            res.cookie('expires', result.expires, { maxAge: 900000, httpOnly: true });
        }
        res.render(_redirectViewName, vm);
    });
};
model.signout = function(req, res, next) {
    userService.signout(req.accessToken, function(err, result) {
        res.cookie('access_token', '', { maxAge: 900000, httpOnly: true });
        res.cookie('expires', '', { maxAge: 900000, httpOnly: true });
        res.redirect('/');
    });
};