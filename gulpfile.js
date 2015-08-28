var gulp = require('gulp');
var Server = require('karma').Server;
var uglify = require('gulp-uglify');

gulp.task('uglify', function() {
  return gulp.src('vnerv.js')
    .pipe(uglify())
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