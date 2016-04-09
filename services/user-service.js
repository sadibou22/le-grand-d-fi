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
    preferences: { type: mongoose.Schema.ObjectId, ref: 'UserPreferences' }
});
mongoose.model('Users', UsersSchema);

var OAuthUsersModel = mongoose.model('OAuthUsers');
var UserPreferencesModel = mongoose.model('UserPreferences');
var UsersModel = mongoose.model('Users');

/**
 * Returns user by username
 */
function getUser(username, callback) {

}
model.getUser = getUser;