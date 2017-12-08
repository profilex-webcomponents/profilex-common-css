'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var tap = require('gulp-tap');
var path = require('path');
var rename = require("gulp-rename");
var foreach = require("gulp-foreach");
var inject = require('gulp-inject-string');

gulp.task('sass', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./src/css'));
});
gulp.task('sass-min', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(rename({ extname: ".min.css" }))
        .pipe(gulp.dest('./build'));
});

gulp.task('sass-wc', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename({ extname: "" }))
        .pipe(foreach(function(stream, file) {
            return stream
                .pipe(inject.prepend('<dom-module id="' + path.basename(file.path) + '"><template><style>'));
        }))
        .pipe(rename({ extname: ".css.html" }))
        .pipe(inject.append('</style></template><dom-module>'))
        .pipe(gulp.dest('./src/web-components'));
});
gulp.task('sass-wc-min', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(rename({ extname: "" }))
        .pipe(foreach(function(stream, file) {
            return stream
                .pipe(inject.prepend('<dom-module id="' + path.basename(file.path) + '"><template><style>'));
        }))
        .pipe(rename({ extname: ".css.min.html" }))
        .pipe(inject.append('</style></template><dom-module>'))
        .pipe(gulp.dest('./build/web-components'));
});

gulp.task('sass:watch', function() {
    gulp.watch('./src/scss/*.scss', ['sass']);
});

gulp.task('run:sass', ['sass', 'sass-min', 'sass-wc', 'sass-wc-min']);