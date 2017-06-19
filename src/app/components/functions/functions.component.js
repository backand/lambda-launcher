/**
 * @ngdoc Component
 * @name LambdaLauncher.component.functions
 *
 * @module LambdaLauncher
 *
 * @description
 * Lambda functions component - Manage applications Lambda functions
 *
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('LambdaLauncher')
    .component('functions', {
      templateUrl: 'app/components/functions/functions.html',
      controller: [
        'Lambda',
        '$log',
        '$state',
        '_',
        'toaster',
        'blockUI',
        'ENV_CONFIG',
        '$injector',
        '$timeout',
        function (Lambda, $log, $state, _, toaster, blockUI, ENV_CONFIG, $injector, $timeout) {
          var $ctrl = this;

          /**
           * component's lifeCycle hooks
           */
          $ctrl.$onInit = initialization;

          /**
           * public methods
           */
          $ctrl.onSelect = onSelect;
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
          }

          function onSelect(fn) {
            $ctrl.function = {};
            $timeout(function () {
              $ctrl.function = angular.copy(fn);
            }, 100);

          }

          //end of controller
        }]
    });
})();
