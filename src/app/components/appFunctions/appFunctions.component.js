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
        function (Lambda, $log, $state) {
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
            Lambda
              .getFunctions(params)
              .then(function (data) {
                $ctrl.functions = data ? data.data : [];
              }).catch(function (data) {
                console.error(data);
              });
          }




        }]
    })
})();
