// This is the Brocfile. It sets up all the assets from the input JS/CSS/images
// and so on and converts them to static assets in the output directory or
// preview server.
var _ = require('underscore');
var babel = require('broccoli-babel-transpiler');
var browserify = require('broccoli-browserify');
var compileSass = require('broccoli-sass');
var funnel = require('broccoli-funnel');
var jade = require('broccoli-jade');
var mergeTrees = require('broccoli-merge-trees');
var templateBuilder = require('broccoli-template-builder');

var sassDir = 'src/stylesheets';
var scripts = 'src/scripts';

// Covert main.scss stylesheet to app.css stylesheet in output directory
var styles = compileSass([sassDir], 'main.scss', 'app.css');

// Process all the JavaScript.
// First we use babel to convert the ES6 to ES5 for web browsers.
scripts = babel(scripts, { browserPolyfill: true });
// Then use browserify to handle any `require` statements and automatically
// insert the required library inline.
scripts = browserify(scripts, {
  entries: ['./app.js'],
  outputFile: 'app.js'
});

// Local assets
var assets = funnel('src/images', {
  destDir: 'images'
});

// This builds all the Javascript Templates (JST) into JS files where the
// templates have been wrapped in functions using underscore's template system.
var templates = templateBuilder('src/scripts/templates', {
  extensions: ['jst'],
  outputFile: 'templates.js',
  compile: function(string) {
    return _.template(string, { variable: "obj" }).source;
  }
});

// Copy external libraries to output directory
// Leaflet
var leaflet = funnel('node_modules/leaflet/dist', {
  destDir: 'scripts',
  files: ['leaflet.js']
});

var leafletStyles = funnel('node_modules/leaflet/dist', {
  destDir: 'styles',
  files: ['leaflet.css']
});

var leafletAssets = funnel('node_modules/leaflet/dist/images', {
  destDir: '/images'
});

// Leaflet Marker Cluster
var cluster = funnel('node_modules/leaflet.markercluster/dist', {
  destDir: 'scripts',
  files: ['leaflet.markercluster.js']
});

var clusterStyles = funnel('node_modules/leaflet.markercluster/dist', {
  destDir: 'styles',
  files: ['MarkerCluster.css', 'MarkerCluster.Default.css']
});

// JQuery
var jquery = funnel('node_modules/jquery/dist', {
  destDir: 'scripts',
  files: ['jquery.min.js', 'jquery.min.map']
});

// JSON2
var json2 = funnel('node_modules/json2/lib/JSON2/static', {
  destDir: 'scripts',
  files: ['json2.js']
});

// JQuery DataTables
var dataTables = funnel('node_modules/datatables/media/js', {
  destDir: 'scripts',
  files: ['jquery.dataTables.min.js']
});

var dataTablesStyles = funnel('node_modules/datatables/media/css', {
  destDir: 'styles',
  files: ['jquery.dataTables.min.css']
});

var dataTablesAssets = funnel('node_modules/datatables/media/images', {
  destDir: 'images',
  include: ['*.png']
});

// Proj4
var proj4 = funnel('node_modules/proj4/dist', {
  destDir: 'scripts'
});

// Proj4Leaflet
var proj4leaflet = funnel('node_modules/proj4leaflet/src', {
  destDir: 'scripts'
});

// PolarMap.js
var polarmap = funnel('node_modules/polarmap/dist', {
  destDir: 'scripts'
});

var polarmapStyles = funnel('node_modules/polarmap/css', {
  destDir: 'styles',
  files: ['polarmap.css']
});

// Underscore
var underscore = funnel('node_modules/underscore', {
  destDir: 'scripts',
  files: ['underscore-min.js', 'underscore-min.map']
});

// Backbone
var backbone = funnel('node_modules/backbone', {
  destDir: 'scripts',
  files: ['backbone-min.js', 'backbone-min.map']
});

// Marionette
var marionette = funnel('node_modules/backbone.marionette/lib', {
  destDir: 'scripts',
  files: ['backbone.marionette.js', 'backbone.marionette.map']
});

// Bootstrap
var bootstrapStyles = funnel('node_modules/bootstrap/dist/css', {
  destDir: 'styles'
});

// Copy Font Awesome files to output directory
var faFonts = funnel('node_modules/font-awesome/fonts', {
  destDir: 'fonts'
});
var faStyles = funnel('node_modules/font-awesome/css', {
  destDir: 'styles'
});

var views = jade('src/views');

module.exports = mergeTrees([styles, scripts, views, templates, assets,
  leaflet, leafletStyles, leafletAssets, cluster, clusterStyles, jquery, json2,
  dataTables, dataTablesStyles, dataTablesAssets, proj4, proj4leaflet, polarmap,
  polarmapStyles, underscore, backbone, marionette, bootstrapStyles, faFonts,
  faStyles], { overwrite: true });
