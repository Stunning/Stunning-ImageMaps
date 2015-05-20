var gulp = require('gulp'),
jshint = require('gulp-jshint'),
uglify = require('gulp-uglify'),
stylish = require('jshint-stylish'),
rename = require('gulp-rename');

gulp.task('lint', function() {
	return gulp.src('./src/stunning-imagemaps.js')
	.pipe( jshint() )
	.pipe( jshint.reporter(stylish) );
});

gulp.task('minify', function() {
	return gulp.src('./src/stunning-imagemaps.js')
	.pipe( uglify() )
	.pipe( rename('stunning-imagemaps.min.js') )
	.pipe( gulp.dest('./dist/') );
});

gulp.task('default', ['lint', 'minify']);