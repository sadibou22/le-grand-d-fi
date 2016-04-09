var express = require('express'),
    exphbs = require('express-handlebars'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    oauthServer = require('oauth2-server-cookie'),
    port = process.env.PORT || 9191,
    oauth2Model = require('./oauth2/mongodb-model'),
    isProd = process.env.NODE_ENV === 'production';

var app = express();

app.use(cookieParser());
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

/**
 * Controllers
 */
var home = require('./controllers/home-controller');
var signin = require('./controllers/signin-controller');
var signup = require('./controllers/signup-controller');
// app.oauth.authorise()
app.get('/', home.index);
app.get('/signin', signin.index);
app.get('/signup', signup.index);
app.post('/signup', signup.register);

app.listen(port, function(err) { console.log('Running server on port ' + port); });