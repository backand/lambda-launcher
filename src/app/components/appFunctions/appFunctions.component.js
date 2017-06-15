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
        'ENV_CONFIG',
        '$injector',
        function (Lambda, $log, $state, _, toaster, blockUI, ENV_CONFIG, $injector) {
          var $ctrl = this;

          /**
           * component's lifeCycle hooks
           */
          $ctrl.$onInit = initialization;

          /**
           * public methods
           */
          $ctrl.runFunction = runFunction;
          $ctrl.getRandomColor = getRandomColor;
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
              }).catch(function (error) {
                blockUI.stop();
                $log.error(error);
                /**
                 * @todo 
                 * This has to be moved to authInterceptor
                 * authInterceptor does not catch response error of a XHR request which is invoked by Bankand.invoke()
                 * discussed with @relly
                 */
                $injector.get('$state').go(ENV_CONFIG.ROUTE_LOGIN_STATE, { error: $base64.encode(error.data), app: $state.params.app }, { reload: true });
                $injector.get('Auth').logout();
              });
          }

          function functionsHandler(data) {
            var functions = data ? data.data.data : [];
            $ctrl.functions = functions;
            if (functions.length > 0) {
              updateFunctionParameters(functions);
            }
          }

          function updateFunctionParameters(functions) {
            _.forEach(functions, function (f) {
              $log.info('function', f);
              var funcParams = Lambda.getParameters(f.iD);
              if (!_.isEmpty(f.inputParameters) && !funcParams) {
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

          function runFunction(func, $event) {
            $event.preventDefault();
            var funcId = func.iD;
            var parameters = Lambda
              .getParameters(funcId);

            /**
             * Lets not stop user to run function if he has not updated params
             */
            /*if (!Lambda.isParamsUpdated(funcId)) {
              $state.go('dashboard.parameters', { function_id: funcId });
              return;
            }*/
            var params = {};
            _.forEach(parameters, function (p) {
              params[p.name] = p.value;
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
                toaster.error('Error', 'Error occured while executing function.');
                $log.error('Function run error', error);
                saveRun(funcId, {
                  Payload: error.statusText,
                  StatusCode: error.status
                });
                blockUI.stop();
              });
          }

          function containsEmptyValue(params) {
            return _.every(params, ['value', '']);
          }

          function getAllRuns() {
            $ctrl.fuctionRuns = Lambda.getRuns();
          }

          function saveRun(funcId, resultSet) {
            $log.info(resultSet);
            var runInstance = angular.copy(resultSet);
            runInstance.executionTime = _.now();
            Lambda.saveRun(funcId, runInstance);
            getAllRuns();
          }

          function getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
              color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
          }

          //end of controller
        }]
    });
})();
