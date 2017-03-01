var gulp = require('gulp');
var ts = require('gulp-typescript');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('tsc', function () {
    var tsResult = tsProject.src()
        .pipe(tsProject());
    var result = tsResult.js.pipe(gulp.dest('bin'));

    return result;
});