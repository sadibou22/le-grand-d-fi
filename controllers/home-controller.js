var model = module.exports;
model.index = function(req, res, next) {
    var vm = {
        viewName: 'Home',
        isSignedIn: (req.userId),
        isSignedOut: !(req.userId)
    };
    res.render('home', vm);
};