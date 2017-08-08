'use strict'

const gulp = require('gulp')
const sass = require('gulp-sass')
const sassGlob = require('gulp-sass-glob')
const autoprefixer = require('gulp-autoprefixer')
const uglifycss = require('gulp-uglifycss')
const include = require('gulp-include')
const addsrc = require('gulp-add-src')
const order = require('gulp-order')
const concat = require('gulp-concat')
const concatCss = require('gulp-concat-css')
const uglify = require('gulp-uglify')
const nodemon = require('nodemon')

gulp.task('sass', function () {
  return gulp.src([
    'public/assets/stylesheets/*.scss',
    './public/assets/stylesheets/sweetalert2.min.css'
  ])
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(concatCss('application.css'))
    .pipe(uglifycss())
    .pipe(gulp.dest('public/assets/stylesheets/'))
})

gulp.task('javascript', function () {
  return gulp.src('public/assets/javascripts/application/*.js')
    .pipe(addsrc('public/assets/javascripts/vendor/index.js'))
    .pipe(order([
      'public/assets/javascripts/vendor/index.js',
      'public/assets/javascripts/application/*.js'
    ], {base: '.'}))
    .pipe(include())
    .pipe(concat('application.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('public/assets/javascripts'))
})

gulp.task('nodemon', function () {
  nodemon({
    script: 'index.js',
    ignore: 'public'
  })
})

gulp.task('build', function () {
  gulp.run('javascript')
  gulp.run('sass')
})

gulp.task('watch', function () {
  gulp.run('build')
  gulp.watch('public/assets/stylesheets/**/**/*.scss', ['sass'])
  gulp.watch('public/assets/javascripts/application/*.js', ['javascript'])
  nodemon({
    script: 'index.js',
    ignore: 'public'
  })
})
