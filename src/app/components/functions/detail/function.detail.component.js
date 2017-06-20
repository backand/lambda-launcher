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
          $ctrl.runFunction = runFunction;
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
            Lambda
              .getFunction({
                id: functionId
              })
              .then(function (response) {
                $ctrl.function = _.get(response, 'data') || {};
              }, function (error) {
                $log.error('Error while getting function -', error);
              });
          }

          function runFunction(func, params) {
            var funcId = func.iD, parameters;

            if (params) {
              parameters = params;
            } else {
              parameters = Lambda
                .getParameters(funcId);
            }
            /**
             * Lets not stop user to run function if he has not updated params
             */
            /*if (!Lambda.isParamsUpdated(funcId)) {
              $state.go('dashboard.parameters', { function_id: funcId });
              return;
            }*/
            var params = {};
            _.forEach(parameters, function (p) {
              params[p.name.trim()] = encodeURIComponent(p.value);
            });
            blockUI.start();
            Lambda
              .runFunction(func.name, params)
              .then(function (response) {
                saveRun(funcId, {
                  Payload: response.data,
                  StatusCode: response.status
                });
                toaster.success('Success', 'Function has been executed successfully.');
                $log.info('Function run successful', response);
                blockUI.stop();
              }, function (error) {
                toaster.error('Error', 'Error occurred while executing function.');
                $log.error('Function run error', error);
                saveRun(funcId, {
                  Payload: error.data.errorMessage || error.data,
                  StatusCode: error.status
                });
                blockUI.stop();
              });
          }

          function saveRun(funcId, resultSet) {
            $log.info(resultSet);
            var runInstance = angular.copy(resultSet);
            runInstance.executionTime = _.now();
            Lambda.saveRun(funcId, runInstance);
            getRuns();
          }



          //end of controller
        }]
    });
})();
