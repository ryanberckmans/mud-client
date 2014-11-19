
var gulp = require('gulp');
var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var mocha = require('gulp-mocha');
var del = require('del');

var paths = {
  client: ['client/**/*', '!client/js/**/*.coffee'],
  coffee: ['client/js/**/*.coffee'],
  test: ['client/test/**/*.coffee'],
  dest: 'build'
}

gulp.task('clean', function() {
  del([paths.dest]);
});

gulp.task('test', function() {
  require('coffee-script/register');
  return gulp.src(paths.test, { read:false })
    .pipe(mocha({
      reporter: 'nyan'
    }));
});

gulp.task('coffee', ['test'], function() {
  return gulp.src(paths.coffee)
    .pipe(sourcemaps.init())
      .pipe(coffee())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dest + '/js'));
});

gulp.task('client', function() {
  return gulp.src(paths.client, { base: 'client' })
    .pipe(gulp.dest(paths.dest));
});

gulp.task('default', ['coffee', 'client']);
