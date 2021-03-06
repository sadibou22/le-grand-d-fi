var model = module.exports;
var userService = require('../services/user-service.js'),
    BaseModel = require('../services/model-service'),
    moment = require('moment');

var _viewName = 'signin',
    _redirectViewName = 'oauthRedirect';

model.index = function (req, res, next) {
    if (req.username) { return res.redirect('/'); }
    var SignInModel = function () {
        var model = new BaseModel(req, _viewName);
        model.csrfToken = req.csrfToken();
        model.returnUrl = req.query.returnUrl ? encodeURIComponent(req.query.returnUrl) : undefined;
        model.username = req.query.username;
        return model;
    };
    var vm = new SignInModel();
    res.render(_viewName, vm);
};
model.validate = function (req, res, next) {
    var SignInModel = function () {
        var model = new BaseModel(req, _viewName);
        model.csrfToken = req.csrfToken();
        model.returnUrl = req.body.returnUrl;
        model.username = req.body.username;
        model.rememberMe = req.body.rememberMe;
        return model;
    };
    var vm = new SignInModel();
    userService.validate(req.body.username, req.body.password, function (err, result) {
        if (!err) {
            var returnParam = '';
            if (vm.returnUrl) { returnParam = '&returnUrl=' + encodeURIComponent(vm.returnUrl); }
            res.redirect('/oauthredirect?token=' + result.token.token + '&expires=' + (moment(result.expires).toString() + returnParam) + '&keep=' + req.body.rememberMe);
        }
        else {
            vm.invalidLogin = true;
            vm.error = { code: 104, msg: 'Invalid login' };
            res.render(_viewName, vm);
        }
    });
};
model.oauthRedirect = function (req, res, next) {
    var SignInModel = function () {
        var model = new BaseModel(req, _viewName);
        model.token = req.query.token;
        model.expires = req.query.expires;
        model.returnUrl = req.query.returnUrl;
        model.hasReturnUrl = (req.query.returnUrl && true);
        model.rememberMe = req.query.keep;
        return model;
    };
    var vm = new SignInModel();
    userService.validateToken(vm.token, function (err, result) {
        if (!err && result) {
            var cookieOptions = { httpOnly: true };
            if (req.query.keep === 'on') {
                cookieOptions.maxAge = 90000000000;
            }
            res.cookie('access_token', result.accessToken,cookieOptions);
            res.cookie('expires', result.expires, cookieOptions);
            return res.render(_redirectViewName, vm);
        }
        else { return res.render('/'); }
    });
};
model.signout = function (req, res, next) {
    userService.signout(req.accessToken, function (err, result) {
        res.cookie('access_token', '', { maxAge: 1, httpOnly: true });
        res.cookie('expires', '', { maxAge: 1, httpOnly: true });
        res.redirect('/');
    });
};