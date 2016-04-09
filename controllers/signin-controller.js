var model = module.exports;
model.index = function(req, res, next) {
    var vm = {
        viewName: 'Signin',
        isSignedIn: (req.user && req.user.id),
        isSignedOut: !(req.user && req.user.id)
    };
    res.render('signin', vm);
};