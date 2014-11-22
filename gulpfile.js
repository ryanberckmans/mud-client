'use strict';
// generated on 2014-11-21 using generator-gulp-webapp 0.1.0

var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var mochaPhantomJS = require('gulp-mocha-phantomjs');

// load plugins
var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {
    return gulp.src('app/styles/main.scss')
        .pipe($.rubySass({
            style: 'expanded',
            precision: 10
        }))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe($.size({title: 'styles'}));
});

gulp.task('coffee', function() {
    return gulp.src('app/scripts/**/*.coffee')
      .pipe($.coffee())
      .pipe(gulp.dest('.tmp/scripts'))
      .pipe($.size({title: 'compiled coffee'}));
});

gulp.task('scripts', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.size({title: 'js'}));
});

gulp.task('html', ['styles', 'scripts', 'coffee'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');

    return gulp.src('app/*.html')
        .pipe($.useref.assets({searchPath: '{.tmp,app}'}))
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size({title: 'html'}));
});

gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size({title: 'images'}));
});

// mainBowerFiles() isn't compatible with an additional gulp.src().
// ie gulp.src(mainBowerFiles()).pipe(gulp.src(...)) doesn't emit the total list of files as you'd expect.
// That's why fonts:bower and fonts:app exist, instead of being one fonts task.
gulp.task('fonts:bower', function () {
    return gulp.src(mainBowerFiles())
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts'))
        .pipe($.size({title: 'bower fonts'}));
});

gulp.task('fonts:app', function () {
    return gulp.src('app/fonts/**/*.{eot,svg,ttf,woff}')
        .pipe(gulp.dest('dist/fonts'))
        .pipe($.size({title: 'app fonts'}));
});

gulp.task('fonts', ['fonts:bower', 'fonts:app']);

gulp.task('extras', function () {
    return gulp.src(['app/*.*', '!app/*.html'], { dot: true })
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
    return gulp.src(['.tmp', 'dist'], { read: false }).pipe($.clean());
});

gulp.task('build', ['html', 'images', 'fonts', 'extras']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('connect', function () {
    var connect = require('connect');
    var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(connect.static('app'))
        .use(connect.static('.tmp'))
        .use(connect.directory('app'));

    require('http').createServer(app)
        .listen(9000)
        .on('listening', function () {
            console.log('Started connect web server on http://localhost:9000');
        });
});

gulp.task('serve', ['connect', 'styles', 'coffee'], function () {
    require('opn')('http://localhost:9000');
});

// inject bower components
gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;

    gulp.src('app/styles/*.scss')
        .pipe(wiredep({
            directory: 'app/bower_components'
        }))
        .pipe(gulp.dest('app/styles'));

    gulp.src('app/*.html')
        .pipe(wiredep({
            directory: 'app/bower_components'
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('watch', ['connect', 'serve'], function () {
    var server = $.livereload();

    // watch for changes

    gulp.watch([
        'app/*.html',
        '.tmp/styles/**/*.css',
        '{.tmp,app}/scripts/**/*.js',
        'app/images/**/*'
    ]).on('change', function (file) {
        server.changed(file.path);
    });

    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/scripts/**/*.coffee', ['coffee']);
    gulp.watch('app/images/**/*', ['images']);
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

gulp.task('test:clean', function () {
    return gulp.src(['.test-tmp', 'test-dist'], { read: false }).pipe($.clean());
});

gulp.task('test:cp-dist', ['build', 'test:clean'], function() {
  return gulp.src('dist/**/*')
    .pipe(gulp.dest('test-dist'));
});

gulp.task('test:coffee', ['test:cp-dist'], function() {
    return gulp.src('test/spec/**/*.coffee')
      .pipe($.coffee())
      .pipe(gulp.dest('.test-tmp/spec'));
});

gulp.task('test:scripts', ['test:cp-dist', 'test:coffee'], function () {
    return gulp.src('test/spec/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
});

gulp.task('test:html', ['test:cp-dist', 'test:scripts'], function () {
    return gulp.src('test/*.html')
        .pipe($.useref.assets({searchPath: '{.test-tmp,test}'}))
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest('test-dist'))
        .pipe($.size({title: 'test html'}));
});

gulp.task('test:build', ['test:html']);

gulp.task('test', ['test:build'], function () {
  return gulp.src('test-dist/index.html')
      .pipe(mochaPhantomJS({
          mocha: {},
          reporter: 'min',
          phantomjs: {
            webSecurityEnabled: false
          }
      }))
      .on('error', function() { this.emit('end'); }); // fail silently; mocha will print an error msg; and, an errored stream will blow up test:watch
});

gulp.task('test:watch', ['test'], function() {
    // test:watch doesn't pick up dependency changes in bower.json or test/bower.json
    gulp.watch([
      'app/*.html',
      'app/scripts/**/*.{js,coffee}',
      'test/*.html',
      'test/spec/**/*.{js,coffee}'], ['test']);
});
