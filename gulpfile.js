'use strict';
// generated on 2014-11-21 using generator-gulp-webapp 0.1.0
// updated on 2015-2-21 by manually comparing output of generator-gulp-webapp 0.2.0

// require('harmonize')();

var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var mochaPhantomJS = require('gulp-mocha-phantomjs');

// load plugins
var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {
    // gulp-ruby-sass doesn't support globs yet, only single files or directories
    // https://github.com/sindresorhus/gulp-ruby-sass/tree/rw/1.0
    return $.rubySass('app/styles/app.scss', {
            style: 'expanded',
            precision: 10,
            sourcemap: true, 
        })
        .on('error', function (err) { console.log(err.message); })
        .pipe(gulp.dest('.tmp/styles'))
        .pipe($.sourcemaps.write())
        .pipe($.size({title: 'styles'}));
});

gulp.task('coffee', function() {
    return gulp.src('app/scripts/**/*.coffee')
      .pipe($.sourcemaps.init())
      .pipe($.coffee())
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest('.tmp/scripts'))
      .pipe($.size({title: 'compiled coffee'}));
});

gulp.task('jshint', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.size({title: 'js'}));
});

gulp.task('html', ['styles', 'jshint', 'coffee'], function () {
    var assets = $.useref.assets({searchPath: '{.tmp,app}'});

    return gulp.src('app/*.html')
        .pipe(assets)
        // Right now, "gulp test" triggers a full build which can be slow:
        // time 5s, comment for -90% .pipe($.if('*.js', $.uglify()))
        // time 300ms, comment for additional -50% .pipe($.if('*.css', $.csso()))
        .pipe(assets.restore())
        .pipe($.useref())
        // time 150ms, comment for additional -33% .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
        .pipe(gulp.dest('dist'))
        .pipe($.size({title: 'html'}));
});

gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size({title: 'images'}));
});

gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')().concat('app/fonts/**/*'))
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts'))
    .pipe($.size({title: 'fonts'}));
});

gulp.task('extras', function () {
    return gulp.src([
        'app/*.*',
        '!app/*.html',
        'node_modules/apache-server-configs/dist/.htaccess'
    ], {
        dot: true
    }).pipe(gulp.dest('dist'))
    .pipe($.size({title: 'extras'}));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('build', ['html', 'images', 'fonts', 'extras']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('connect', ['styles'], function () {
  var serveStatic = require('serve-static');
  var serveIndex = require('serve-index');
  var app = require('connect')()
    .use(require('connect-livereload')({port: 35729}))
    .use(serveStatic('.tmp'))
    .use(serveStatic('app'))
    // paths to bower_components should be relative to the current file
    // e.g. in app/index.html you should use ../bower_components
    .use('/bower_components', serveStatic('bower_components'))
    .use(serveIndex('app'));

  require('http').createServer(app)
    .listen(9000)
    .on('listening', function () {
      console.log('Started connect web server on http://localhost:9000');
    });
});

gulp.task('serve', ['connect', 'watch', 'coffee'], function () {
    require('opn')('http://localhost:9000');
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/styles/*.scss')
    .pipe(wiredep())
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep())
    .pipe(gulp.dest('app'));
});

gulp.task('watch', ['connect'], function () {
    $.livereload.listen();

    // watch for changes
    gulp.watch([
        'app/*.html',
        '{.tmp,app}/styles/**/*.css',
        '{.tmp,app}/scripts/**/*.js',
        'app/images/**/*'
    ]).on('change', $.livereload.changed);

    gulp.watch('app/scripts/**/*.coffee', ['coffee']);
    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('bower.json', ['wiredep']);
});

// ************************
// Test Tasks below here
// ************************

// What's going on with this test stategy?
// I would like to run my tests against the same code being deployed to production.
// When running yeoman gulp-webapp, I was surprised to find that the test/ directory
// is a mini website, complete with a separate bower.json for declaring test dependencies.
// So, gulp-webapp (1) has a highly sophisticated build process for app/, and,
//                 (2) has a mini website in test/ which itself has no tasks in this gulpfile.
//
// My test strategy is to duplicate the app/ build process for the test website,
// and deploy the test website _on top_ of the regular build. Accomplish as so:
// 
// 1. build the regular website
// 2. copy dist/ to test-dist/
// 3. build test/ into test-dist/   (using .test-tmp/ for compiled coffeescript)
// 4. run the tests using the final build in test-dist/

gulp.task('test:clean', require('del').bind(null, ['.test-tmp', 'test-dist']));

gulp.task('test:cp-dist', ['build', 'test:clean'], function() {
  return gulp.src('dist/**/*')
    .pipe(gulp.dest('test-dist'));
});

// test:coffee shouldn't depend on test:clean,
// but does so to prevent a race condition where test:clean errors
// due to test:coffee.dest() preventing del from rmdir
gulp.task('test:coffee', ['test:clean'], function() {
    return gulp.src('test/spec/**/*.coffee')
      .pipe($.sourcemaps.init())
      .pipe($.coffee())
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest('.test-tmp/spec'))
      .pipe($.size({title: 'compiled test coffee'}));
});

gulp.task('test:jshint', function () {
    return gulp.src('test/spec/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.size({title: 'test js'}));
});

gulp.task('test:html', ['test:cp-dist', 'test:jshint', 'test:coffee'], function () {
    var assets = $.useref.assets({searchPath: '{.test-tmp,test}'});

    return gulp.src('test/*.html')
        .pipe(assets)
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest('test-dist'))
        .pipe($.size({title: 'test html'}));
});

gulp.task('test:build', ['test:html']);

gulp.task('test', ['test:build'], function () {
  return gulp.src('test-dist/index.html')
      .pipe(mochaPhantomJS({
          mocha: {},
          // reporters: find . | grep mocha.*reporter
          // reports that blow up: nyan :<
          // 
          reporter: 'nyan',
          phantomjs: {
            webSecurityEnabled: false
          }
      }))
      .on('error', function() { this.emit('end'); }); // fail silently; mocha will print an error msg; and, an errored stream will blow up test:watch
});

gulp.task('test:watch', ['test'], function() {
    // test:watch doesn't pick up dependency changes in bower.json or test/bower.json
    gulp.watch([
      'app/scripts/**/*.{js,coffee}',
      'test/*.html',
      'test/spec/**/*.{js,coffee}'], ['test']);
});

gulp.task('tw', ['test:watch']);
