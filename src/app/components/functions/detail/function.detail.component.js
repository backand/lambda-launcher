/**
 * @ngdoc Component
 * @name LambdaLauncher.component.functionDetail
 *
 * @module LambdaLauncher
 *
 * @description
 * Lambda function detail component
 *
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('LambdaLauncher')
    .component('functionDetail', {
      bindings: {
      },
      templateUrl: 'app/components/functions/detail/functions.detail.html',
      controller: [
        '$log',
        '_',
        '$stateParams',
        'Lambda',
        'blockUI',
        'toaster',
        '$rootScope',
        function ($log, _, $stateParams, Lambda, blockUI, toaster, $rootScope) {
          var $ctrl = this,
            functionId = $stateParams.function_id;

          /**
           * component's lifeCycle hooks
           */
          $ctrl.$onInit = initialization;
          $ctrl.launchFunction = launchFunction;
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
            console.log($stateParams);
            getFunction();
            getRuns();
          }
          function getRuns() {
            $ctrl.runs = Lambda.getRun(functionId);
          }
          function getFunction() {
             $ctrl.function = Lambda
              .getFunction(functionId) || {};
          }

          function launchFunction(fn){
            $rootScope.$emit('EVENT:LAUNCH_FUNCTION', {
              function : angular.copy(fn)
            })
          }
          //end of controller
        }]
    });
})();
