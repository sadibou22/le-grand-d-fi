var model = module.exports;
var userService = require('../services/user-service.js');
var viewName = 'signup';
var completeViewName = 'signup-complete';
model.index = function(req, res, next) {
    var vm = {
        viewName: viewName,
        isSignedIn: (req.user && req.user.id),
        isSignedOut: !(req.user && req.user.id),
        csrfToken: req.csrfToken()
    };
    res.render(viewName, vm);
};
model.register = function(req, res, next) {
    var vm = {
        viewName: viewName,
        isSignedIn: (req.user && req.user.id),
        isSignedOut: !(req.user && req.user.id),
        user: req.body
    };
    try {
        userService.saveUser(req.body, function(err, success) {
            res.redirect('/');
        });
    }
    catch (err) {
        render(res, vm, err);
    }
};
function render(res, vm, errors) {
    vm.errors = errors;
    res.render(viewName, vm);
}