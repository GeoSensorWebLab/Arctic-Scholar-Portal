var gulp      = require('gulp'),
    // this is an arbitrary object that loads all gulp plugins in package.json.
    $         = require("gulp-load-plugins")(),
    express   = require('express'),
    assets    = require('connect-assets'),
    app       = express();

gulp.task('express', function() {
  app.set('views', 'src/views');
  app.set('view engine', 'jade');
  require('./routes')(app);

  assets = assets({
    paths: [
      'src/scripts',
      'src/images',
      'src/stylesheets',
      'src/views'
      ],
    buildDir: 'dist',
    gzip: true
  });
  assets.mincer.MacroProcessor.configure(['.js', '.css']);
  app.use(assets);

  app.use('/images', express.static('./src/images'));

  app.listen(1337);
  $.util.log('Listening on port: 1337');
});

// Default Task
gulp.task('default', ['express']);
