var express = require('express'),
    exphbs = require('express-handlebars'),
    port = process.env.PORT || 9191,
    isProd = process.env.NODE_ENV === 'production';

var app = express();
app.use(express.static('public'));
app.engine('html', exphbs({
    defaultLayout: 'main',
    extname      : '.html'
}));
app.set('view engine', 'html');
app.get('/', function(req, res) {
    res.render('home');
});

app.listen(port, function(err) { console.log('Running server on port ' + port); });