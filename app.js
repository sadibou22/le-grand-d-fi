var express = require('express'),
    exphbs = require('express-handlebars'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    csurf = require('csurf'),
    oauthServer = require('oauth2-server'),
    port = process.env.PORT || 9191,
    oauth2Model = require('./oauth2/mongodb-model'),
    isProd = process.env.NODE_ENV === 'production',
    user = require('./services/user-handler'),
    authorization = require('./services/authorization-handler');

var app = express();
var csrfProtection = csurf({ cookie: true });

app.use(cookieParser('session-secret'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
oauth2Model.warmUp(function(res) { console.log('Database warmed up'); });
app.oauth = oauthServer({
    model: oauth2Model,
    grants: ['password'],
    debug: true
});
app.all('/oauth/token', app.oauth.grant());

app.use(express.static('public'));
app.engine('html', exphbs({
    defaultLayout: 'main',
    extname: '.html'
}));
app.set('view engine', 'html');

app.use(user.setUser);

/**
 * Controllers
 */
var home = require('./controllers/home-controller');
var passwordreset = require('./controllers/passwordreset-controller');
var profile = require('./controllers/profile-controller');
var signin = require('./controllers/signin-controller');
var signup = require('./controllers/signup-controller');

// app.oauth.authorise()
app.get('/', home.index);
app.get('/oauthredirect', signin.oauthRedirect);
app.get('/profile', authorization(), csrfProtection, profile.index);
app.get('/reinitialize', csrfProtection, passwordreset.showChangePassword);
app.post('/reinitialize', csrfProtection, passwordreset.doChangePassword);
app.get('/reset', csrfProtection, passwordreset.showRequestCode);
app.post('/reset', csrfProtection, passwordreset.doRequestCode);
app.get('/signin', csrfProtection, signin.index);
app.post('/signin', csrfProtection, signin.validate);
app.get('/signout', signin.signout);
app.get('/signup', csrfProtection, signup.index);
app.post('/signup', csrfProtection, signup.register);

app.listen(port, function(err) { console.log('Running server on port ' + port); });