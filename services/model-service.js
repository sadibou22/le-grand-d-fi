module.exports = function BaseModel(req, viewName) {
    return {
        viewName: viewName,
        isSignedIn: (req.username),
        isSignedOut: !(req.username)
    };
};