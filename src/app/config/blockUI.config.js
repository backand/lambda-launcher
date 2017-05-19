/**
 * @ngdoc config
 * @name LambdaLauncher.config
 *
 * @module LambdaLauncher
 *
 * @description
 * Configure blockUI module
 * Display loader while XHR request is pending
 * Display loader on state transition
 * block inline element
 * Usage -
 * Inject blockUI service
 * blockUI.start()
 * blockUI.stop()
 * 
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';

  angular
    .module('LambdaLauncher')
    .config(blockUIConfig);
  /** @ngInject */
  function blockUIConfig(blockUIConfig) {
    blockUIConfig.delay = 0;
    blockUIConfig.template = '<div class="block-ui-overlay"></div><div class="block-ui-message-container" aria-live="assertive" aria-atomic="true"><div class="block-ui-message"><div class="sk-fading-circle"><div class="sk-circle1 sk-circle"></div><div class="sk-circle2 sk-circle"></div><div class="sk-circle3 sk-circle"></div><div class="sk-circle4 sk-circle"></div><div class="sk-circle5 sk-circle"></div><div class="sk-circle6 sk-circle"></div><div class="sk-circle7 sk-circle"></div><div class="sk-circle8 sk-circle"></div><div class="sk-circle9 sk-circle"></div><div class="sk-circle10 sk-circle"></div><div class="sk-circle11 sk-circle"></div><div class="sk-circle12 sk-circle"></div></div></div></div>';
    blockUIConfig.blockBrowserNavigation = true;
    blockUIConfig.autoBlock = false;
    //blockUIConfig.autoInjectBodyBlock = false;
  }
})();