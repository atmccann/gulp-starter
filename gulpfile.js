/*global require*/
"use strict";

var gulp = require('gulp'),
	gutil = require('gulp-util'),
	data = require('gulp-data'),
	browserify = require('gulp-browserify'),
	browserSync = require('browser-sync'),
	fs = require('fs'),
	file = require('gulp-file'),
	jade = require('gulp-jade'),
	less = require('gulp-less'),
	path = require('path'),
	prefix = require('gulp-autoprefixer'),
	sass = require('gulp-sass'),
	_ = require('underscore');

/*
* Change directories here
*/
var settings = {
	publicDir: '_site',
	sassDir: 'assets/css',
	cssDir: '_site/assets/css'
};

// My js files
gulp.task('scripts', function() {
    // Single entry point to browserify 
    gulp.src('src/_js/app.js')
        .pipe(browserify({
          insertGlobals : true,
          debug : !gulp.env.production
        }))
        .pipe(gulp.dest('./_site/assets/js'));
});

/**
 * De-caching function for Data files
 */
function requireUncached( $module ) {
    delete require.cache[require.resolve( $module )];
    return require( $module );
}

/**
 * Compile .jade files and pass in data from json file
 * matching file name. index.jade - index.jade.json
 */

 gulp.task('jade', ['data'], function() {

   var utils = require('./src/_js/utils.js');
   var data = JSON.parse(fs.readFileSync('./_site/assets/data/artists.json', 'utf-8'));

   return gulp.src('*.jade')
     .pipe(jade({
       locals: {
         _: _,
         utils: utils,
         data: data
       }
     }))
     .on('error', function(e) {
       gutil.beep();
       console.log(e.message.red);
     })
     .pipe(gulp.dest(settings.publicDir));
 });

/**
 * Recompile .jade files and live reload the browser
 */
gulp.task('jade-rebuild', ['jade'], function () {
	browserSync.reload();
});

gulp.task('js-rebuild', ['scripts'], function () {
	browserSync.reload();
});

/**
 * Wait for jade and sass tasks, then launch the browser-sync Server
 */
gulp.task('browser-sync', ['sass', 'jade', 'data', 'scripts'], function () {
	browserSync({
		server: {
			baseDir: settings.publicDir
		},
		notify: false
	});
});

/**
 * Compile .scss files into public css directory With autoprefixer no
 * need for vendor prefixes then live reload the browser.
 */
gulp.task('sass', function () {
	return gulp.src(settings.sassDir + '/*.scss')
		.pipe(sass({
			includePaths: [settings.sassDir],
			outputStyle: 'compressed'
		}))
		.on('error', sass.logError)
		.pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
		.pipe(gulp.dest(settings.cssDir))
		.pipe(browserSync.reload({stream: true}));
});

/*compile data*/
gulp.task('data', function() {
  // Combine all the JSON files in src/data
  // TODO: Clean this up

  var data = {};
  _.each(fs.readdirSync('./src/_data/'), function(filename) {
    if (filename !== '.keep' && filename !== '.DS_Store') {
      var contents = fs.readFileSync('./src/_data/' + filename, 'utf-8');
      data[filename.slice(0, -5)] = JSON.parse(contents);
    }
  });
  file('projects.json', JSON.stringify(data, null, 2)).pipe(gulp.dest('./_site/assets/data'));

  return gulp.src('src/_data/**/*.json')
    .pipe(gulp.dest('./_site/assets/data/'));
});

/**
 * Watch scss files for changes & recompile
 * Watch .jade files run jade-rebuild then reload BrowserSync
 */
gulp.task('watch', function () {
	gulp.watch('src/_js/app.js', ['js-rebuild']);
	gulp.watch(settings.sassDir + '/**', ['sass']);
	gulp.watch(['*.jade', '**/*.jade', '**/*.json'], ['jade-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync then watch
 * files for changes
 */
gulp.task('default', ['browser-sync', 'watch']);
