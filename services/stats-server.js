var model = module.exports;
model.Server = function (config) {
    var self = this;
    var _io;
    if (!config.io) { throw 'socket.io not found'; }
    _io = config.io;
    _io.on('connection', function (socket) {
        console.log('a user connected');
    });
    function stats(req, res, next) {
        res.statsServer = self;
        next();
    }
    self.stats = stats;
    return self;
};