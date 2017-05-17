/**
 * @ngdoc Component
 * @name LambdaLauncher.component.layout
 *
 * @module LambdaLauncher
 *
 * @description
 * layout component - A application main component which render application layout
 *
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('LambdaLauncher')
    .component('layout', {
      template: '<toaster-container toaster-options="{\'time-out\': 2000}"></toaster-container><div class="app-content" id="app-content"><div class="container"><app-header data-is-authenticated="$ctrl.isAuthenticated"></app-header></div><div ui-view></div><div class="container"><app-footer></app-footer></div></div>',
      controller: [
        '$log',
        'Backand',
        '$state',
        'toaster',
        function ($log, Backand, $state,toaster) {
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
            $ctrl.isAuthenticated = true;
          }
        }]
    });
})();
