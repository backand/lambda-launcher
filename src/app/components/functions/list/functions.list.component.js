/**
 * @ngdoc Component
 * @name LambdaLauncher.component.functionsList
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
    .component('functionsList', {
      bindings: {
        onSelect: '&'
      },
      templateUrl: 'app/components/functions/list/functions.list.html',
      controller: [
        'Lambda',
        '$log',
        '$state',
        '_',
        'toaster',
        'blockUI',
        'ENV_CONFIG',
        '$injector',
        'App',
        '$scope',
        function (Lambda, $log, $state, _, toaster, blockUI, ENV_CONFIG, $injector, App, $scope) {
          var $ctrl = this;

          /**
           * component's lifeCycle hooks
           */
          $ctrl.$onInit = initialization;

          /**
           * public methods
           */
          $ctrl.getRandomColor = getRandomColor;
          $ctrl.selectFn = selectFn;
          /**
           * public properties
           */
          $ctrl.App = App;

          /**
            * @function
            * @name initialization
            * @description
            * A component's lifeCycle hook which is called after all the controllers on an element have
            * been constructed and had their bindings initialized
            */
          function initialization() {
            $ctrl._ = _;
            $ctrl.$state = $state;
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
            var functions = data || [];
            $ctrl.functions = functions;
            if (functions.length > 0) {
              updateFunctionParameters(functions);
              if ($ctrl.$state.params.function_id) {
                var fn = _.find($ctrl.functions, {iD : Number($ctrl.$state.params.function_id)});
                if (fn && !App.isSmallDevice()) {
                  App.setDetailView(false);
                  selectFn(fn);
                }
              }
            }
            if (!$ctrl.$state.params.function_id) {
              if (!App.isSmallDevice()) {
                App.setDetailView(false);
                selectFn($ctrl.functions[0]);
              }
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

          function getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
              color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
          }

          function selectFn(fn) {
            if (App.isSmallDevice()) {
              App.setDetailView(true);
            }
            $state.go('dashboard.appFunctions.detail', { function_id: fn.iD });
          }

          $scope.$watch(function(){
            return Lambda.getRuns();
          },function(newV, oldV){
            $ctrl.runs = angular.copy(newV);
          },true)
          //end of controller
        }]
    });
})();
