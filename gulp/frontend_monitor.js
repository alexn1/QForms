const path      = require('path');
const gulp      = require('gulp');
//const uglify    = require('gulp-uglify');
const concat    = require('gulp-concat');
const less      = require('gulp-less');
const sourcemaps = require('gulp-sourcemaps');
const babel      = require('gulp-babel');
const hash = require('gulp-hash-filename');
const myOrder = require('./myOrder');
const cleanCSS = require('gulp-clean-css');

const SRC_PATH   = './src';
const BUILD_PATH = './dist';


function frontend_monitor_js() {
    return gulp.src(path.join(SRC_PATH, 'frontend/monitor/**/*.js'))
        .pipe(myOrder())
        // .pipe(sourcemaps.init())
        .pipe(concat('monitor.js'))
        .pipe(hash({"format": "{name}.{hash}{ext}"}))
        //.pipe(uglify())
        // .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.join(BUILD_PATH, 'lib/frontend/monitor/js')));
}

function frontend_monitor_jsx() {
    return gulp.src(path.join(SRC_PATH, 'frontend/monitor/**/*.jsx'))
        .pipe(myOrder())
        // .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('monitor-jsx.js'))
        .pipe(hash({"format": "{name}.{hash}{ext}"}))
        // .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.join(BUILD_PATH, 'lib/frontend/monitor/js')));
}

function frontend_monitor_less() {
    return gulp.src(path.join(SRC_PATH, 'frontend/monitor/**/*.less'))
        .pipe(myOrder())
        // .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(concat('monitor.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(hash({"format": "{name}.{hash}{ext}"}))
        // .pipe(minifyCss())
        // .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.join(BUILD_PATH, 'lib/frontend/monitor/css')));
}

const frontend_monitor = gulp.series(
    frontend_monitor_js,
    frontend_monitor_jsx,
    frontend_monitor_less
);

module.exports = frontend_monitor;
