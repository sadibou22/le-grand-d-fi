var model = module.exports,
    ih = require('insanehash'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserPreferencesSchema = new Schema({
    active: { type: Boolean, default: false },
    canBeContacted: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: false }
});
mongoose.model('UserPreferences', UserPreferencesSchema);

var UsersSchema = new Schema({
    username: { type: String, required: true, index: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    preferences: { type: mongoose.Schema.ObjectId, ref: 'UserPreferences' },
    oauthData: { type: mongoose.Schema.ObjectId, ref: 'OAuthUsers' }
});
mongoose.model('Users', UsersSchema);

var OAuthUsersModel = mongoose.model('OAuthUsers');
var UserPreferencesModel = mongoose.model('UserPreferences');
var UsersModel = mongoose.model('Users');

/**
 * Returns user by username in callback
 */
function getUser(username, callback) {
    OAuthUsersModel.findOne({ username: username }, callback);
}
model.getUser = getUser;
/**
 * Saves user in database
 */
function saveUser(user, callback) {
    model.getUser(user.username, function(err, found) {
        if (err) {
            throw '100: Error at getUser: ' + err;
        }
        if (found) {
            throw '400: User already exists: ' + err;
        }
        else {
            var model = new UsersModel({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                preferences: new UserPreferencesModel({
                    active: false,
                    canBeContacted: user.canBeContacted,
                    isVisible: false
                })
            });
            var password = ih.keccak(user.password);
            var oauthUserModel = new OAuthUsersModel({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: password
            });
            model.oauthData = oauthUserModel;
            model.save(callback);
        }
    });
}
model.saveUser = saveUser;
