
var gulp = require('gulp');
var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');

var paths = {
  client: ['client/**/*', '!client/js/**/*.coffee'],
  coffee: ['client/js/**/*.coffee'],
  dest: 'build'
}

gulp.task('clean', function() {
  del([paths.dest]);
});

gulp.task('coffee', function() {
  return gulp.src(paths.coffee)
    .pipe(sourcemaps.init())
      .pipe(coffee())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dest + '/js'));
});

gulp.task('client', function() {
  return gulp.src(paths.client, {base: 'client'})
    .pipe(gulp.dest(paths.dest))
});

gulp.task('default', ['coffee', 'client']);
