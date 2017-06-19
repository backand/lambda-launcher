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
      bindings : {
      },
      templateUrl: 'app/components/functions/detail/functions.detail.html',
      controller: [
        '$log',
        '_',
        '$stateParams',
        'Lambda',
        function ($log, _, $stateParams, Lambda) {
          var $ctrl = this,
          functionId = $stateParams.function_id;

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
            console.log($stateParams);
            getFunction();
          }
          function getFunction(){
            Lambda
            .getFunction({
              id : functionId
            })
            .then(function(response){
              $ctrl.function = _.get(response, 'data') || {};
            },function(error){
              $log.error('Error while getting function -', error);
            });
          }
          //end of controller
        }]
    });
})();
