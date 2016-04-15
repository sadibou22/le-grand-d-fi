var model = module.exports;
var profileService = require('../services/profile-service.js'),
    moment = require('moment');

var _viewName = 'profile';

model.index = function(req, res) {
    var vm = {
        viewName: _viewName,
        isSignedIn: (req.username),
        isSignedOut: !(req.username)
    };
    res.render(_viewName, vm);
};