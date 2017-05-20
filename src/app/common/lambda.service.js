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
    .service('Lambda', LambdaService);
  /** @ngInject */
  function LambdaService(Backand, $q, $localStorage, _, $timeout) {
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

    self.runFunction = function (action, data, params) {
      var deffered = $q.defer();
      if (!_.isString(action) && _.isEmpty(action)) {
        throw Error('Invalid action');
      }
      data = data || {};
      params = params || {};

      Backand.invoke({
        method: 'GET',
        url: '/1/function/general/' + action + '?parameters=' + angular.toJson(data),
        params: params
      }).then(function (response) {
        deffered.resolve(response.data);
      }).catch(function (error) {
        deffered.reject(error);
      });

      return deffered.promise;
    }

    self.getParameters = function (function_id) {
      return function_id ? $localStorage.parameters[function_id] : $localStorage.parameters;
    };

    self.saveParameters = function (fId, params) {
      var deffered = $q.defer();
      if (!fId || _.isEmpty(params)) {
        throw Error('fId and params are required to store function parameters');
      }
      var parameters = self.getParameters();
      parameters = parameters || {};
      var fParams = parameters[fId];
      if (!_.isArray(fParams)) {
        fParams = [];
      }
      if (_.isArray(params)) {
        _.forEach(params, function (p) {
          storeParameter(fParams, p);
        })
      } else {
        storeParameter(fParams, params);
      }
      parameters[fId] = fParams;
      $localStorage.parameters = parameters;
      $timeout(function () {
        deffered.resolve(parameters);
      }, 1);
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

    self.saveRun = function (fId, run) {
      var runs = self.getRuns();
      runs[fId] = run;
      $localStorage.runs = angular.copy(runs);
    };

    //end of service  
  }
})();