var model = module.exports;
model.index = function(req, res, next) {
    var vm = {
        viewName: 'Home',
        isSignedIn: (req.user && req.user.id),
        isSignedOut: !(req.user && req.user.id)
    };
    res.render('home', vm);
};