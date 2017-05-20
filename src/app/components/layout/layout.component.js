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
      template: '<toaster-container toaster-options="{\'time-out\': 3000}"></toaster-container><block-ui></block-ui><div class="app-content" id="app-content"><div class="container"><app-header data-is-authenticated="$ctrl.isAuthenticated()"></app-header></div><div ui-view></div><div class="container"><app-footer></app-footer></div></div>',
      controller: [
        '$log',
        'Backand',
        '$state',
        'toaster',
        'Auth',
        function ($log, Backand, $state,toaster,Auth) {
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
            
            $ctrl.isAuthenticated = Auth.isAuthenticated;
            
          }
        }]
    });
})();
