var gulp = require('gulp');
var Server = require('karma').Server;
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('uglify', function() {
  return gulp.src('vnerv.js')
    .pipe(uglify())
    .pipe(rename('vnerv.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('test', function (done) {
    return new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('tdd', function(done) {
    return new Server({
        configFile: __dirname + '/karma.conf.js'
    }, done).start();
});
