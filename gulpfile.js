
var gulp = require('gulp');
var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');
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
    .pipe(coffee())
    .pipe(gulp.dest(paths.dest + '/js'));
});

gulp.task('client', function() {
  return gulp.src(paths.client, { base: 'client' })
    .pipe(gulp.dest(paths.dest));
});

gulp.task('watch', function() {
  gulp.watch([paths.coffee, paths.test], ['test'])
});

gulp.task('build', ['test', 'coffee', 'client']);

gulp.task('default', ['build']);
