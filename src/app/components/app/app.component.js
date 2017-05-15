/**
 * @ngdoc Component
 * @name LambdaLauncher.component.app
 *
 * @module LambdaLauncher
 *
 * @description
 * app component - A application main component
 * renders application layout
 *
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('LambdaLauncher')
    .component('app', {
      template: '<div class="app-content" id="app-content"><div class="container"><app-header></app-header></div><div ui-view></div><div class="container"><app-footer></app-footer></div></div>',
      controller: [
        '$log',
        'Backand',
        '$stateParams',
        function ($log, Backand, $stateParams) {
          var $ctrl = this;

          /**
           * component's lifeCycle hooks
           */
          $ctrl.$onInit = initialization;

          /**
           * public methods
           */
          /**
           * public properties
           */
          /**
            * @function
            * @name initialization
            * @description
            * A component's lifeCycle hook which is called after all the controllers on an element have
            * been constructed and had their bindings initialized
            */
          function initialization() {
            $log.info('app component initialized');
            $log.info('State params' , $stateParams);
          }
        }]
    });
})();
