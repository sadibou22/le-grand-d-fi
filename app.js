var express = require('express'),
    exphbs = require('express-handlebars'),
    bodyParser = require('body-parser'),
    oauthServer = require('oauth2-server'),
    port = process.env.PORT || 9191,
    oauth2Model = require('./oauth2/mongodb-model'),
    isProd = process.env.NODE_ENV === 'production';

var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.oauth = oauthServer({
    model: {}, // See below for specification
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
app.get('/', home.index);
app.get('/signin', signin.index);

app.listen(port, function(err) { console.log('Running server on port ' + port); });