var model = module.exports;
var profileService = require('../services/profile-service.js'),
    moment = require('moment');

var _viewName = 'profile';

model.index = function(req, res){
    res.render(_viewName);
}