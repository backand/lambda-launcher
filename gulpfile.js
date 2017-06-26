/**
 *  Welcome to your gulpfile!
 *  The gulp tasks are split into several files in the gulp directory
 *  because putting it all here was too long
 */

'use strict';

var fs = require('fs');
var gulp = require('gulp');

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
fs.readdirSync('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file);
});


/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
gulp.task('default', ['clean'], function () {
  gulp.start('build');
});

//backand sync --app lambdalauncher --master e923eafd-1853-46b8-b0e9-99b336979035 --user e6b8e25f-6eb3-4919-a44f-91c95f480cf8 --folder /Users/itay/dev/lambda-launcher/dist

//qa
/*
backand sync --app lambdademoqa --master a8af5e53-d05e-4f0c-ac63-d3b70a3306ba --user eddb6882-587d-11e7-9066-06bcf2b21c8c --folder /Users/itay/dev/lambda-launcher/dist
*/