var model = module.exports;
model.Finder = function(config) {
    var self = this;
    var _config = (config) ? config : {
        byConvention: true
    };
    Object.defineProperty(self, 'config', {
        get: function() { return _config; }
    });
    self.find = find;
    return self;
    /**
     * Find command by name
     */
    function find(commandName) {
        if (config.byConvention) {
            var runnerByConvention = require(commandName + '-runner');
            return runnerByConvention;
        }
        else if (config.resolver) {
            var resolver = config.resolver;
            return resolver.resolve(commandName);
        }
        throw 'Resolver not set';
    }
};