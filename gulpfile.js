const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-dart-sass');
const rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const webpack = require("webpack-stream");
const imageminWebp = require('imagemin-webp');
const extReplace = require("gulp-ext-replace");


const dist = "./dist/";


gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: dist,
            index: "index.html"
        },
        ui: {
            port: 4000
        }
    });
});

gulp.task('html', function () {
    return gulp.src('./src/*.html')
        .pipe(gulp.dest(dist));
});



gulp.task('sass', function() {
    return gulp.src(`./src/sass/**/*.+(scss|sass)`)
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({
            prefix: "",
            suffix: ".min",
        }))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(dist + `/css/`))
        .pipe(browserSync.stream());
});



gulp.task('watch', function () {
    gulp.watch("./src/sass/**/*.+(scss|sass|css)", gulp.parallel('sass'));
    gulp.watch("./src/*.html").on("change", browserSync.reload);
    gulp.watch("./src/*.html").on("change", gulp.parallel('html'));
    gulp.watch("./src/js/**/*").on("change", gulp.parallel('build-js'));
});


gulp.task('font', function () {
    return gulp.src('./src/font/**/*')
        .pipe(gulp.dest(dist + '/font'));
});

gulp.task('icons', function () {
    return gulp.src('./src/icon/*')
        .pipe(gulp.dest(dist + '/icon'));
});

gulp.task('images', function () {
    return gulp.src('./src/img/**/*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            }),
        ]))
        .pipe(gulp.dest(dist + '/img'));
});

gulp.task("images:webp", function() {
    return gulp.src('./src/img/**/*.+(jpg|png)')
        .pipe(imagemin([
            imageminWebp({
                quality: 50,
            })
        ]))
        .pipe(extReplace(".webp"))
        .pipe(gulp.dest( dist + "/img"));
});


gulp.task('build-js', () => {
    return gulp.src(`./src/js/index.js`)
        .pipe(webpack({
            mode: 'development',
            output: {
                filename: 'script.js'
            },
            watch: false,
            devtool: "source-map",
            module: {
                rules: [
                    {
                        test: /\.m?js$/,
                        exclude: /(node_modules|bower_components)/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: [['@babel/preset-env', {
                                    debug: true,
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                            }
                        }
                    }
                ]
            }
        }))
        .pipe(gulp.dest(dist + '/js'))
        .on("end", browserSync.reload);
});


gulp.task('default', gulp.parallel('server', 'watch', 'html', 'sass', 'font', 'icons', 'build-js', 'images:webp', 'images'));