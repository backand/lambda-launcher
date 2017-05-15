'use strict';

var gulp = require('gulp');
var pump = require('pump');
var rename = require('gulp-rename');
var ngConstant = require('gulp-ng-constant');
var conf = require('./conf');

var env = require('dotenv').config({
  path: './.env',
});

gulp.task('envConstants', function (callback) {
  pump([
    ngConstant({
      name: 'LambdaLauncher.envConfig',
      constants: {
        'ENV_CONFIG': env.parsed
      },
      deps: [],
      stream: true,
      wrap: false
    }),
    rename('env.constants.js'),
    gulp.dest(conf.paths.src + '/app/common/')
  ], callback);


});