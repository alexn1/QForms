'use strict';

const path      = require('path');
const gulp      = require('gulp');
//const uglify    = require('gulp-uglify');
const minifyCss = require('gulp-minify-css');
const concat    = require('gulp-concat');
const less      = require('gulp-less');

const BUILD_PATH = './build';
const SRC_PATH   = "./src";

function frontend_common_class_less() {
    return gulp.src(path.join(SRC_PATH, 'frontend/common/class/**/*.less'))
        .pipe(less())
        .pipe(concat('all.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest(path.join(BUILD_PATH, 'lib/frontend/common/class')));
}

function frontend_common_class_js() {
    return gulp.src(path.join(SRC_PATH, 'frontend/common/class/**/*.js'))
        .pipe(concat('all.js'))
        //.pipe(uglify())
        .pipe(gulp.dest(path.join(BUILD_PATH, 'lib/frontend/common/class')));
}

function frontend_common_img() {
    return gulp.src(path.join(SRC_PATH, 'frontend/common/img/**/*'))
        .pipe(gulp.dest(path.join(BUILD_PATH, 'lib/frontend/common/img')));
}

function frontend_common_lib() {
    return gulp.src(path.join(SRC_PATH, 'frontend/common/lib/**/*'))
        .pipe(gulp.dest(path.join(BUILD_PATH, 'lib/frontend/common/lib')));
}

const frontend_common_class = gulp.series(frontend_common_class_js, frontend_common_class_less);
const frontend_common       = gulp.series(frontend_common_class, frontend_common_img, frontend_common_lib);

module.exports = frontend_common;