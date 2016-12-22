var gulp        = require('gulp');
var uglify		= require('gulp-uglify');

gulp.task("uglify-js", function() {
    return gulp.src("src/*.js")
        .pipe(uglify({
            compress: {
                hoist_funs: true,
                hoist_vars: false,
                warnings: false,
                drop_console: false,
                keep_fnames: false,
                passes: 1
            }
        }))
        .pipe(gulp.dest("dist/"));
});

gulp.task("default", ["uglify-js"]);