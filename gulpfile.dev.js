var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var inject = require('gulp-inject');
var notify = require('gulp-notify');
var newer = require('gulp-newer');
var size = require('gulp-size');
var imagemin = require('gulp-imagemin');
var urlAdjuster = require('gulp-css-url-adjuster');
var streamSeries = require('stream-series');

sass.compiler = require('node-sass');

var {
    js: {
        app: jsApp,
        lib: jsLib,
        dist: jsDist
    },
    sass: {
        app: sassApp,
        dist: sassDist
    },
    html: {
        app: htmlApp,
        dist: htmlDist
    },
    image: {
        app: imageApp,
        dist: imageDist
    }
} = require('./paths.config');

var imageConfig = {
    src: imageApp.glob,
    build: imageDist.default,
    minOpt: {
        optimizationLevel: 5
    }
};

gulp.task('images', function () {
    return gulp
        .src(imageConfig.src)
        .pipe(newer(imageConfig.build))
        .pipe(imagemin(imageConfig.minOpt))
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(imageConfig.build))
});

var includePaths = [
    path.join(__dirname, 'app', 'lib')
];
gulp.task('sass', function () {
    return gulp
        .src(sassApp.glob)
        .pipe(sass({
            outputStyle: 'expand',
            includePaths
        }).on('error', notify.onError()))
        .pipe(urlAdjuster({
            prepend: '/dist/img/'
        }))
        .pipe(gulp.dest(sassDist.default))
        .pipe(browserSync.stream());
});

gulp.task('js:lib', function () {
    return gulp
        .src(jsLib.default)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest(jsDist.default))
        .pipe(browserSync.stream());
});

gulp.task('js:app', function () {
    return gulp
        .src(jsApp.glob)
        .pipe(concat('app.js'))
        .pipe(gulp.dest(jsDist.default))
        .pipe(browserSync.stream());
});

gulp.task('html', function () {
    var target = gulp.src(htmlApp.default);
    var jsLibStream = gulp.src([`${jsDist.default}/lib.js`], {
        read: false
    });
    var jsAppStream = gulp.src([`${jsDist.default}/app.js`], {
        read: false
    });
    var cssAppStream = gulp.src([`${sassDist.default}/app.css`], {
        read: false
    });

    return target
        .pipe(inject(streamSeries(cssAppStream, jsLibStream, jsAppStream), {
            relative: true
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
        notify: false,
        ui: {
            port: 8081,
            weinre: {
                port: 8082
            }
        },
        port: 8080,
        open: false
    });
});

gulp.task('watch', ['images', 'sass', 'js:lib', 'js:app', 'html', 'browser-sync'], function () {
    gulp.watch(sassApp.glob, ['sass']);
    gulp.watch(jsLib.glob, ['js:lib']);
    gulp.watch(jsApp.glob, ['js:app']);
    gulp.watch(htmlApp.default, ['html']);
    gulp.watch(htmlDist.glob).on('change', browserSync.reload);
});

gulp.task('default', ['watch']);
