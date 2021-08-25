const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass')(require('node-sass'))

function serve() {
    browserSync.init({
        server: './app'
    })

    gulp.watch('app/scss/*.scss', runSass)
    gulp.watch('app/*.html').on('change', browserSync.reload)
}

function runSass() {
    return gulp.src('app/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream())
}

exports.default = gulp.series(runSass, serve)
