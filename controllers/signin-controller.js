var model = module.exports;
model.index = function(req, res, next) {
    var vm = {
        viewName: 'Signin',
        isSignedIn: (req.userId),
        isSignedOut: !(req.userId)
    };
    res.render('signin', vm);
};