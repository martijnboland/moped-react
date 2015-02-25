var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var merge = require('merge-stream');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify'); 
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var notify = require('gulp-notify');
var less = require('gulp-less');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var gutil = require('gulp-util');
var template = require('gulp-template');
var config = require('./build.config');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// Default to dev config
var env = config.env.dev;

// === Browserify ===

var runBrowserify = function (watch) {
  var appBundler = browserify({
    entries: ['./src/app/main.jsx'],
    transform: [
      babelify // Convert JSX and ES6
    ], 
    debug: ! env.isProduction, // Sourcemapping
    cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
  });
  appBundler.external(! env.isProduction ? config.vendorNpmPackages : []);
  
  if (watch) {
    // if watch is enable, wrap this bundle inside watchify
    appBundler = watchify(appBundler);
    appBundler.on('update', function(){
      bundleApp(appBundler);
    });
  }
  
  if (! env.isProduction) {
    runBrowserifyExternals();
  }

  return bundleApp(appBundler);
};

var bundleApp = function (appBundler) {
  var start = Date.now();
  console.log('Building APP bundle');
  return appBundler.bundle()
    .on('error', gutil.log)
    .pipe(source(env.appNameAndVersion + '.js'))
    .pipe(gulpif(env.isProduction, streamify(uglify())))
    .pipe(gulp.dest(env.dest))
    .pipe(reload({stream: true, once: true}))
    .pipe(notify(function () {
      console.log('APP bundle built in ' + (Date.now() - start) + 'ms');
    }));
};

var runBrowserifyExternals = function() {
  var vendorsBundler = browserify({
    debug: ! env.isProduction,
    require: config.vendorNpmPackages
  });

  var start = new Date();
  console.log('Building VENDORS bundle');
  return vendorsBundler.bundle()
    .on('error', gutil.log)
    .pipe(source('vendors.js'))
    .pipe(gulpif(env.isProduction, streamify(uglify())))
    .pipe(gulp.dest(env.dest))
    .pipe(notify(function () {
      console.log('VENDORS bundle built in ' + (Date.now() - start) + 'ms');
    }));
};

// === Less compiling ===

var compileLess = function () {
  var start = new Date();
  return gulp.src(config.appFiles.less)
    .pipe(less())
    .pipe(concat(env.appNameAndVersion + ".css"))
    .pipe(gulpif(env.isProduction, cssmin()))
    .pipe(gulp.dest(env.dest + '/assets/css'))
    .pipe(notify(function () {
      console.log('LESS bundle built in ' + (Date.now() - start) + 'ms');
  }));
};

// === Tasks ===

gulp.task('clean:build', function (done) {
  del(['build'], done);
});

gulp.task('clean:dist', function (done) {
  del(['dist'], done);
});

gulp.task('copy-assets', function () {
  var assets = gulp.src(config.appFiles.assets)
    .pipe(gulp.dest(env.dest + '/assets'));
  var fonts = gulp.src(config.vendorFiles.fonts)
    .pipe(gulp.dest(env.dest + '/assets/fonts'));
  return merge(assets, fonts);
});

gulp.task('compile-less', function () {
  return compileLess();
});

gulp.task('browserify:nowatch', function(){
  return runBrowserify(false);
});

gulp.task('browserify:watch', function(){
  return runBrowserify(true);
});

gulp.task('index', function () {
  var jsFiles = [env.appNameAndVersion + '.js'];
  if (! env.isProduction) {
    jsFiles.splice(0, 0, 'vendors.js');
  }
  var cssFiles = ['assets/css/' + env.appNameAndVersion + '.css'];
  return gulp.src('src/index.html')
    .pipe(template({ scripts: jsFiles, styles: cssFiles}))
    .pipe(gulp.dest(env.dest));
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./build"
        }
    });
});

// Default creates a dev build
gulp.task('default', function () {
  runSequence('clean:build', ['browserify:nowatch', 'copy-assets', 'compile-less', 'index']);
});

// Create a dev build and watch files
gulp.task('watch', function () {
  runSequence('clean:build', ['browserify:watch', 'copy-assets', 'compile-less', 'index'], 'browser-sync');
  gulp.watch("./src/less/**/*.less", [ 'compileLess', reload]);
  gulp.watch("./src/index.html", [ 'index', reload]);
});

// Create a production build
gulp.task('dist', function () {
  env = config.env.prod;
  runSequence('clean:dist', ['browserify:nowatch', 'copy-assets', 'compile-less', 'index']);
});

