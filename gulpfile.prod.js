var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var inject = require('gulp-inject');
var notify = require('gulp-notify');
var newer = require('gulp-newer');
var size = require('gulp-size');
var imagemin = require('gulp-imagemin');
var urlAdjuster = require('gulp-css-url-adjuster');
var uglify = require('gulp-uglify');
var cleancss = require('gulp-clean-css');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var streamSeries = require('stream-series');
var del = require('del');
var runSequence = require('run-sequence');
var rev = require('gulp-rev');
var revRewrite = require('gulp-rev-rewrite');
var revDelete = require('gulp-rev-delete-original');
var htmlmin = require('gulp-htmlmin');

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
    },
    revision: {
        app: revisionApp,
        dist: revisionDist
    }
} = require('./paths.config');

var imageConfig = {
    othersImageFormatSrc: imageApp.glob,
    jpgImageFormatSrc: imageApp.default,
    build: imageDist.default,
    othersImageFormatMinOpt: {
        optimizationLevel: 5
    },
    jpgImageFormatMinOpt: {
        progressive: true
    }
};

gulp.task('images:others', function () {
    return gulp
        .src(imageConfig.othersImageFormatSrc)
        .pipe(newer(imageConfig.build))
        .pipe(imagemin(imageConfig.othersImageFormatMinOpt))
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(imageConfig.build))
});

gulp.task('images:jpg', function () {
    return gulp
        .src(imageConfig.jpgImageFormatSrc)
        .pipe(newer(imageConfig.build))
        .pipe(imagemin(imageConfig.jpgImageFormatMinOpt))
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(imageConfig.build))
});

gulp.task('images', ['images:others', 'images:jpg']);

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
            prepend: '/img/'
        }))
        .pipe(rename({
            suffix: '',
            prefix: ''
        }))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(cleancss({
            level: {
                1: {
                    specialComments: 0
                }
            }
        }))
        .pipe(gulp.dest(sassDist.default))
});

gulp.task('js:jquery', function () {
    return gulp
        .src(jsLib.exclude)
        .pipe(gulp.dest(jsDist.default))
});

gulp.task('js:lib', function () {
    return gulp
        .src(jsLib.default)
        .pipe(concat('lib.js'))
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(gulp.dest(jsDist.default))
});

gulp.task('preload:lib', function () {
    return gulp
        .src(jsLib.default)
        .pipe(concat('lib.preload'))
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(gulp.dest(jsDist.default))
});

gulp.task('js:app', function () {
    return gulp
        .src(jsApp.glob)
        .pipe(concat('app.js'))
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(gulp.dest(jsDist.default))
});

gulp.task('preload:app', function () {
    return gulp
        .src(jsApp.glob)
        .pipe(concat('app.preload'))
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(gulp.dest(jsDist.default))
});

gulp.task('html', ['js:lib', 'js:app', 'js:jquery', 'preload:lib', 'preload:app', 'sass'], function () {
    var target = gulp.src(htmlApp.default);
    var jsLibStream = gulp.src([`${jsDist.default}/lib.js`], {
        read: false
    });
    var jsAppStream = gulp.src([`${jsDist.default}/app.js`], {
        read: false
    });
    var preloadLibStream = gulp.src([`${jsDist.default}/lib.preload`], {
        read: false
    });
    var preloadAppStream = gulp.src([`${jsDist.default}/app.preload`], {
        read: false
    });
    var cssAppStream = gulp.src([`${sassDist.default}/app.css`], {
        read: false
    });

    return target
        .pipe(
            inject(
                streamSeries(cssAppStream, jsLibStream, jsAppStream, preloadLibStream, preloadAppStream), {
                    relative: false,
                    ignorePath: 'app/dist',
                    addRootSlash: false,
                    transform(filepath) {
                        if (filepath.slice(-8) === '.preload') {
                            return `<link rel="preload" href="${filepath.replace('preload', 'js')}" as="script"/>`;
                        }
                        return inject.transform.apply(inject.transform, arguments);
                    }
                }
            )
        )
        .pipe(gulp.dest(htmlDist.default))
});

gulp.task('html:minify', () => {
    return gulp.src(htmlDist.glob)
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: true,
            removeScriptTypeAttributes: true,
            removeRedundantAttributes: true,
            removeStyleLinkTypeAttributes: true
        }))
        .pipe(gulp.dest(htmlDist.default));
});

gulp.task('revision', ['images', 'js:lib', 'js:app', 'preload:lib', 'preload:app', 'sass'], function () {
    var revisionSrc = revisionApp.glob;
    if (revisionApp.exclude) revisionSrc = [revisionSrc].concat(revisionApp.exclude);

    return gulp.src(revisionSrc)
        .pipe(rev())
        .pipe(revDelete({
            exclude: /(?:china|england)\.jpg$/
        }))
        .pipe(gulp.dest(revisionDist.default))
        .pipe(rev.manifest())
        .pipe(gulp.dest(revisionDist.default));
});

gulp.task('revRewrite:html', ['revision'], function () {
    var manifest = gulp.src(`${revisionDist.default}/rev-manifest.json`);

    return gulp.src(htmlDist.glob)
        .pipe(revRewrite({
            manifest
        }))
        .pipe(gulp.dest(htmlDist.default));
});

gulp.task('revRewrite:css', ['revision'], function () {
    var manifest = gulp.src(`${revisionDist.default}/rev-manifest.json`);

    return gulp.src(`${sassDist.default}/*.css`)
        .pipe(revRewrite({
            manifest
        }))
        .pipe(gulp.dest(sassDist.default));
});

gulp.task('revRewrite', ['revRewrite:html', 'revRewrite:css']);

gulp.task('build', function (cb) {
    runSequence('html', 'revRewrite', 'html:minify', 'clean:preload', cb);
});

gulp.task('clean', function () {
    return del.sync(['app/dist', 'app/index.html'], function (error, paths) {
        console.error(error)
    });
});

gulp.task('clean:preload', function () {
    return del.sync(['app/dist/**/*.preload'], function (error, paths) {
        console.error(error)
    });
});

gulp.task('prod', function (cb) {
    runSequence('clean', 'build', cb);
});

gulp.task('default', ['prod']);
