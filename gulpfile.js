/*global require*/
"use strict";

var gulp = require('gulp'),
	concat = require('gulp-concat'),
	striplog = require('gulp-strip-debug'),
	gutil = require('gulp-util'),
	uglify = require('gulp-uglify'),
	fs = require('fs'),
	file = require('gulp-file'),
	path = require('path'),
	data = require('gulp-data'),
	jade = require('gulp-jade'),
	prefix = require('gulp-autoprefixer'),
	sass = require('gulp-sass'),
	_ = require('underscore'),
	browserSync = require('browser-sync');

/*
* Change directories here
*/
var settings = {
	publicDir: '_site',
	sassDir: 'assets/css',
	cssDir: '_site/assets/css', 
	js_src:'src/_js/*.js',
	js_dest:'_site/assets/js'
};

// My js files
gulp.task('scripts', function() {
  // pipe the js through concat, console log stripping, uglification and then store
  return gulp.src(settings.js_src)
      .pipe(concat('app.min.js')) // concat all files in the src
      .pipe(striplog())
      .pipe(uglify())   // uglify them all
      .pipe(gulp.dest(settings.js_dest)) // save the file
      .on('error', gutil.log); 
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
	gulp.watch(settings.sassDir + '/**', ['sass']);
	gulp.watch(['*.jade', '**/*.jade', '**/*.json'], ['jade-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync then watch
 * files for changes
 */
gulp.task('default', ['browser-sync', 'watch']);
