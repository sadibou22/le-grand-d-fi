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
    userService.saveUser(req.body, function(err, success) {
        if (!err) {
            //res.redirect('/');
            res.redirect('/signin?from=signup&username=' + encodeURI(req.body.username));
        }
        else {
            //We've got an error
            vm.error = err;
            vm.error.isUsernameError = err.code === 101;
            vm.error.isEmailError = err.code === 102;
            vm.user = req.body;
            vm.csrfToken = req.csrfToken();
            res.render(viewName, vm);
        }
    });
};
function render(res, vm, errors) {
    vm.errors = errors;
    res.render(viewName, vm);
}