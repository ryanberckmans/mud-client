
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var del = require('del');

var paths = {
  client: 'wm_client/*'
}

gulp.task('client', function() {
  return gulp.src(paths.client, { base: 'wm_client'})
    .pipe(gulp.dest('build'))
});

gulp.task('default', ['client']);
