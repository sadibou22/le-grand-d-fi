var model = module.exports,
    ih = require('insanehash'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _clientId = 'DefiDBWeb',
    _clientSecret = '$c4ecb4ef',
    _dbUri = 'mongodb://defidbuser:dbpass@ds064748.mlab.com:64748/defidb';

mongoose.connect(_dbUri, function(err, res) {
    if (err) { console.log('ERROR connecting to: ' + _dbUri + '. ' + err); }
    else { console.log('Succeeded connected to: ' + _dbUri); }
});

//
// Schemas definitions
//
var OAuthAccessTokensSchema = new Schema({
    accessToken: { type: String },
    clientId: { type: String },
    userId: { type: String },
    expires: { type: Date }
});

var OAuthRefreshTokensSchema = new Schema({
    refreshToken: { type: String },
    clientId: { type: String },
    userId: { type: String },
    expires: { type: Date }
});

var OAuthClientsSchema = new Schema({
    clientId: { type: String, index: true },
    clientSecret: { type: String },
    redirectUri: { type: String }
});

var OAuthUsersSchema = new Schema({
    username: { type: String },
    password: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String, default: '' }
});

mongoose.model('OAuthAccessTokens', OAuthAccessTokensSchema);
mongoose.model('OAuthRefreshTokens', OAuthRefreshTokensSchema);
mongoose.model('OAuthClients', OAuthClientsSchema);
mongoose.model('OAuthUsers', OAuthUsersSchema);

var OAuthAccessTokensModel = mongoose.model('OAuthAccessTokens'),
    OAuthRefreshTokensModel = mongoose.model('OAuthRefreshTokens'),
    OAuthClientsModel = mongoose.model('OAuthClients'),
    OAuthUsersModel = mongoose.model('OAuthUsers');

model.warmUp = function(callback) {
    OAuthClientsModel.findOne({
        clientId: _clientId
    }, function(err, client) {
        if (!client) {
            client = new OAuthClientsModel({
                clientId: _clientId,
                clientSecret: _clientSecret,
                redirectUri: ','
            });
            client.save(callback);
        }
        else { callback(); }
    });
};

//
// oauth2-server callbacks
//
model.getAccessToken = function(bearerToken, callback) {
    console.log('in getAccessToken (bearerToken: ' + bearerToken + ')');
    OAuthAccessTokensModel.findOne({
        accessToken: bearerToken
    }, callback);
};

model.getClient = function(clientId, clientSecret, callback) {
    console.log('in getClient (clientId: ' + clientId + ', clientSecret: ' + clientSecret + ')');
    if (clientSecret === null) {
        return OAuthClientsModel.findOne({
            clientId: clientId
        }, callback);
    }
    OAuthClientsModel.findOne({
        clientId: clientId, clientSecret: clientSecret
    }, callback);
};

// This will very much depend on your setup, I wouldn't advise doing anything exactly like this but
// it gives an example of how to use the method to resrict certain grant types
var authorizedClientIds = ['s6BhdRkqt3', 'toto'];
model.grantTypeAllowed = function(clientId, grantType, callback) {
    console.log('in grantTypeAllowed (clientId: ' + clientId + ', grantType: ' + grantType + ')');
    if (grantType === 'password') {
        return callback(false, authorizedClientIds.indexOf(clientId) >= 0);
    }
    callback(false, true);
};

model.saveAccessToken = function(token, clientId, expires, userId, callback) {
    console.log('in saveAccessToken (token: ' + token + ', clientId: ' + clientId + ', userId: ' + userId + ', expires: ' + expires + ')');
    var accessToken = new OAuthAccessTokensModel({ accessToken: token, clientId: clientId, userId: userId, expires: expires });
    accessToken.save(callback);
};

/*
 * Required to support password grant type
 */
model.getUser = function(username, password, callback) {
    var hashedPass = ih.keccak(password);
    console.log('in getUser (username: ' + username + ', password: ' + hashedPass + ')');
    OAuthUsersModel.findOne({
        username: username, password: hashedPass
    }, function(err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user._id);
    });
};

/*
 * Required to support refreshToken grant type
 */
model.saveRefreshToken = function(token, clientId, expires, userId, callback) {
    console.log('in saveRefreshToken (token: ' + token + ', clientId: ' + clientId + ', userId: ' + userId + ', expires: ' + expires + ')');
    var refreshToken = new OAuthRefreshTokensModel({
        refreshToken: token,
        clientId: clientId,
        userId: userId,
        expires: expires
    });
    refreshToken.save(callback);
};

model.getRefreshToken = function(refreshToken, callback) {
    console.log('in getRefreshToken (refreshToken: ' + refreshToken + ')');
    OAuthRefreshTokensModel.findOne({
        refreshToken: refreshToken
    }, callback);
};
