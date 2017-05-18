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
      '$localStorage',
      '_',
      '$timeout',
      function (Backand, $q, $localStorage, _, $timeout) {
        var self = this;

        self.getFunctions = function (params) {
          var deffered = $q.defer();
          params = params || {};
          Backand.invoke({
            method: 'GET',
            url: '/1/action/config',
            params: params
          }).then(function (response) {
            deffered.resolve(response.data);
          }, function (error) {
            deffered.reject(error);
          });
          return deffered.promise;
        };

        self.getParameters = function (function_id) {
          var deffered = $q.defer(), parameters;
          if (function_id) {
            parameters = $localStorage.parameters[function_id] || [];
          } else {
            parameters = $localStorage.parameters || {};
          }
          $timeout(function () {
            deffered.resolve(parameters);
          }, 1)
          return deffered.promise;
        };

        self.saveParameters = function (fId, params) {
          var deffered = $q.defer(), parameters;
          if (!fId || _.isEmpty(params)) {
            throw Error('fId and params are required to store function parameters');
          }
          self.getParameters()
            .then(function (parameters) {
              parameters = parameters || {};
              var pIdx,
                fParams = parameters[fId];
              if (!_.isArray(fParams)) {
                fParams = [];
              }
              if (_.isArray(params)) {
                _.forEach(params, function (p) {
                  storeParameter(fParams, p);
                })
              } else {
                storeParameter(fParams, param);;
              }
              parameters[fId] = fParams;
              $localStorage.parameters = parameters;
              $timeout(function () {
                deffered.resolve(parameters);
              }, 1);
            });
          return deffered.promise;
        };

        function storeParameter(list, param) {
          var pIdx = _.findIndex(list, { key: param.key });
          if (pIdx >= 0) {
            list[pIdx] = angular.extend(param, list[pIdx]);
          } else {
            list.push(param);
          }

          return list;
        }

        self.getRuns = function () {
          return $localStorage.runs || {};
        };

        self.saveRun = function (run) {
          var runs = self.getRuns();
          runs[run.id] = run;
          $localStorage.runs = angular.copy(runs);
        };

        //end of service  
      }]);
})();