/**
 * @ngdoc Component
 * @name LambdaLauncher.component.appFunctions
 *
 * @module LambdaLauncher
 *
 * @description
 * appFunctions component - Manage applications Lambda functions
 *
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('LambdaLauncher')
    .component('appFunctions', {
      templateUrl: 'app/components/appFunctions/appFunctions.html',
      controller: [
        'Lambda',
        '$log',
        '$state',
        '_',
        'toaster',
        'blockUI',
        function (Lambda, $log, $state, _, toaster, blockUI) {
          var $ctrl = this;

          /**
           * component's lifeCycle hooks
           */
          $ctrl.$onInit = initialization;

          /**
           * public methods
           */
          $ctrl.runFunction = runFunction;
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
            getAllRuns();
            getFunctions();
          }

          function getFunctions() {
            var params = {
              pageSize: 200,
              filter: [
                {
                  fieldName: "actionType",
                  operator: "equals",
                  value: "Function"
                }
              ]
            };
            blockUI.start();
            Lambda
              .getFunctions(params)
              .then(function (data) {
                blockUI.stop();
                functionsHandler(data);
              }).catch(function (data) {
                blockUI.stop();
                $log.error(data);
              });
          }

          function functionsHandler(data) {
            var functions = data ? data.data : [];
            $ctrl.functions = functions;
            if (functions.length > 0) {
              updateFunctionParameters(functions);
            }
          }

          function updateFunctionParameters(functions) {
            _.forEach(functions, function (f) {
              $log.info('function', f);
              if (!_.isEmpty(f.inputParameters)) {
                var params = _.split(f.inputParameters, ',');
                $log.info('inputParameters', f);
                params = _.map(params, function (p) {
                  return {
                    name: p,
                    value: '',
                    key: _.camelCase(p)
                  }
                });
                Lambda
                  .saveParameters(f.iD, params);
              }
            });
          }

          function runFunction(func) {
            blockUI.start();
            var funcId = func.iD;
            Lambda
              .getParameters(funcId)
              .then(function (parameters) {
                if (containsEmptyValue(parameters)) {
                  $state.go('dashboard.parameters', { function_id: funcId });
                  return;
                }
                var params = {};
                _.forEach(parameters, function (p) {
                  params[p.name] = p.value;
                });
                Lambda
                  .runFunction(func.name, params)
                  .then(function (response) {
                    saveRun(funcId, response);
                    toaster.success('Success', 'Function has been executed successfully.');
                    $log.info('Function run successful', response);
                    blockUI.stop();
                  }, function (error) {
                    toaster.error('Error', 'Error occured while executing function.');
                    $log.error('Function run error', error);
                    blockUI.stop();
                  });
              });
          }

          function containsEmptyValue(params) {
            return _.every(params, ['value', '']);
          }

          function getAllRuns() {
            Lambda
              .getRuns()
              .then(function (runs) {
                $ctrl.fuctionRuns = angular.copy(runs);
              });
          }

          function saveRun(funcId, resultSet) {
            $log.info(resultSet);
            var runInstance = angular.copy(resultSet);
            runInstance.executionTime = _.now();
            Lambda.saveRun(funcId, runInstance);
            getAllRuns();
          }


          //end of controller
        }]
    });
})();
