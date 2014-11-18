
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var del = require('del');

var paths = {
  client: 'client/*'
}

gulp.task('clean', function() {
  del(['build']);
});

gulp.task('client', function() {
  return gulp.src(paths.client, { base: 'client'})
    .pipe(gulp.dest('build'))
});

gulp.task('default', ['client']);
