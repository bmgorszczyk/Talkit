var gulp              = require('gulp');
var sass              = require('gulp-sass');
var autoprefixer      = require('gulp-autoprefixer');
var browserSync       = require('browser-sync');
var livereload        = require('gulp-livereload');
var nodemon           = require('gulp-nodemon');

gulp.task('ejs',function(){
    return gulp.src('./views/*.ejs')
    .pipe(livereload());
});

gulp.task('sass', function(){
    return gulp.src('./public/sass/**/*.scss')
          .pipe(sass().on('error', sass.logError))
          .pipe(autoprefixer({
            browsers: ['last 3 versions']
          }))
          .pipe(gulp.dest('./public/css'))
          .pipe(livereload());
});

gulp.task('nodemon', function (cb) {

	var started = false;

	return nodemon({
		script: 'server.js'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true;
		}
	});
});

gulp.task('watch', function(){
    livereload.listen();
    gulp.watch('./views/*.ejs', ['ejs']);
    gulp.watch('./public/sass/**/*.scss', ['sass']);
});

gulp.task('default', ['nodemon', 'ejs', 'sass', 'watch']);
