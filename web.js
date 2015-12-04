var express   = require('express'),
    assets    = require('connect-assets'),
    logfmt    = require('logfmt'),
    app       = express();

var port = Number(process.env.PORT || 1337);
app.use(logfmt.requestLogger());
app.set('views', 'src/views');
app.set('view engine', 'jade');
require('./routes')(app);

assets = assets({
  paths: [
    'src/scripts',
    'src/stylesheets',
    'src/views',
    'bower_components'
    ],
  buildDir: 'dist',
  gzip: true
});
assets.mincer.MacroProcessor.configure(['.js']);

app.use(assets);
app.use('/images', express.static(__dirname + '/src/images'));

app.listen(port);
console.log('Listening on port: ' + port);
