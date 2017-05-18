/**
 * @ngdoc service
 * @name LambdaLauncher.service.Lambda
 *
 * @module LambdaLauncher
 *
 * @description
 * A service to manage Lambda functions
 * 
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';

  angular
    .module('LambdaLauncher')
    .service('Lambda', [
      'Backand',
      '$q',
      function (Backand, $q) {
        var self = this;

        self.getFunctions = function (params) {
          var deffered = $q.defer();
          params = params || {};
          Backand.invoke({
            method: 'GET',
            url: '/1/action/config',
            params : params
          }).then(function (response) {
            deffered.resolve(response.data);
          }, function (error) {
            deffered.reject(error);
          });
          return deffered.promise;
        };

        //end of service  
      }]);
})();