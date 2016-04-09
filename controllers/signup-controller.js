var model = module.exports;
model.index = function(req, res, next) {
    var vm = {
        viewName: 'SignUp',
        isSignedIn: (req.user && req.user.id),
        isSignedOut: !(req.user && req.user.id)
    };
    res.render('signup', vm);
};
model.register = function(req, res, next){
    var vm = {
        viewName: 'SignUp',
        isSignedIn: (req.user && req.user.id),
        isSignedOut: !(req.user && req.user.id)
    };
    res.render('signup', vm);
};