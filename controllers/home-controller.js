var model = module.exports;
model.index = function(req, res, next) {
    var vm = {
        viewName: 'Home',
        isSignedIn: (req.username),
        isSignedOut: !(req.username)
    };
    res.render('home', vm);
};