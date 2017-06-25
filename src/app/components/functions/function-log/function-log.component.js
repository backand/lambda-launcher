/**
 * @ngdoc Component
 * @name LambdaLauncher.component.functionLog
 *
 * @module LambdaLauncher
 *
 * @description
 * Lambda functions list component - Manage applications Lambda functions
 *
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('LambdaLauncher')
    .component('functionLog', {
      bindings: {
        function: '<',
        runs : '<'
      },
      templateUrl: 'app/components/functions/function-log/function-log.html',
      controller: [
        'Lambda',
        '$log',
        '_',
        '$rootScope',
        '$scope',
        function (Lambda, $log, _, $rootScope, $scope) {
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
            $log.warn('function runs ', $ctrl.runs);
            getRuns();
          }

          function getRuns() {
          }
          //end of controller
        }]
    });
})();
