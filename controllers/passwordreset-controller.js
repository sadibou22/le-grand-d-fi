var model = module.exports;
var BaseModel = require('../services/model-service'),
    passwordService = require('../services/password-service.js'),
    moment = require('moment');

var _resetRequestViewName = 'passwordresetrequestform';
var _resetViewName = 'passwordresetform';

var ResetModel = function (req, viewName) {
    var model = new BaseModel(req, viewName);
    model.csrfToken = req.csrfToken();
    model.username = req.query.username ? req.query.username : req.body.username;
    return model;
};
var ChangePasswordModel = function (req, viewName) {
    var model = new BaseModel(req, _resetViewName);
    model.csrfToken = req.csrfToken();
    model.code = req.body.code;
    model.password = req.body.password;
    model.username = req.body.username;
    return model;
};

model.showRequestCode = function (req, res) {
    var vm = new ResetModel(req, _resetRequestViewName);
    res.render(vm.viewName, vm);
};
model.doRequestCode = function (req, res) {
    var vm = new ResetModel(req, _resetViewName);
    passwordService.generateResetCode(req.body.username, function (err, result) {
        if (!err) {
            return res.redirect('/reinitialize?username=' + vm.username);
        }
        vm.viewName = _resetRequestViewName;
        vm.error = { code: 205, msg: 'reset code not generated', error: err };
        res.render(vm.viewName, vm);
    });
};
model.showChangePassword = function (req, res) {
    var vm = new ResetModel(req, _resetViewName);
    return res.render(vm.viewName, vm);
};
model.doChangePassword = function (req, res) {
    var vm = new ChangePasswordModel(req, _resetViewName);
    passwordService.changePassword(req.body, function (err, result) {
        if (err) {
            vm.code = req.body.code;
            vm.error = err;
            vm.error.isPasswordMismatchError = err.code === 107;
            vm.error.isResetError = err.code >= 200;
            vm.error.isUnknownError = !err.code;
            return res.render(vm.viewName, vm);
        }
        else {
            return res.redirect('/signin');
        }
    });
};