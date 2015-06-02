/**
 * Created by Bender on 01.06.2015.
 */

var gulp        = require('gulp');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var uglify      = require('gulp-uglify');
var rename      = require('gulp-rename');
var sourcemaps  = require('gulp-sourcemaps');
var buffer      = require('vinyl-buffer');
var sftp        = require('gulp-sftp');
var auth        = require('./auth.json');


gulp.task('app-debug',function (){
    return browserify({
            entries: './src/main.js',
            debug: true
        })
        .bundle()
        .on('error',function(error){
            console.log(error);
        })
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./js/'))
        .pipe(sftp({
            host:'192.168.0.98',
            user:auth.login,
            pass:auth.pass,
            remotePath:'/home/www/tz/js'
        }));
});

gulp.task('app-prodaction',function (){
    return browserify({
        entries: './src/main.js',
        debug: true
    })
        .bundle()
        .on('error',function(error){
            console.log(error);
        })
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(uglify({
            mangle: true,
            compress: {
                sequences: true,
                properties: true,
                dead_code: true,
                conditionals: true,
                booleans: true,
                unused: true,
                if_return: true,
                join_vars: true,
                drop_debugger: true,
                drop_console: true
            }
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./js/'))
});