/**
 * @ngdoc service
 * @name LambdaLauncher.service.Lambda
 * @module LambdaLauncher
 *
 * @description
 * A service to manage Lambda functions
 * @requires Backand, $q, $localStorage, _, $timeout
 * 
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';

  angular
    .module('LambdaLauncher')
    .service('Lambda', LambdaService);
  /** @ngInject */
  function LambdaService(Backand, $q, $localStorage, _, $timeout, $rootScope) {
    var self = this,
      functions = [];

    /**
     * Exposed bindable methods
     */
    self.getFunctions = getFunctions;
    self.runFunction = runFunction;
    self.getParameters = getParameters;
    self.saveParameters = saveParameters;
    self.getRun = getRun;
    self.getRuns = getRuns;
    self.saveRun = saveRun;
    self.enableSaveParams = enableSaveParams;
    self.isSaveParamEnable = isSaveParamEnable;
    self.getFunction = getFunction;


    /**
     * @name getFunctions
     * @description get all available lambda functions of current user
     * 
     * @param {object} params Addtional Query parameters
     * @returns promise
     */
    function getFunctions(params) {
      var deffered = $q.defer();
      params = params || {};
      Backand.invoke({
        method: 'GET',
        url: '1/action/config',
        params: params
      }).then(function (response) {
        var functions = _.get(response, 'data.data');
        self.functions = functions || [];
        deffered.resolve(functions);
        $rootScope.$emit('EVENT:ON_LOAD_FUNCTIONS');
      }).catch(function (err) {
        deffered.reject(err);
      });
      return deffered.promise;
    }

    /**
     * @name getFunction
     * @description get function By iD
     * 
     * @param {object} fnId function Id
     * @returns function
     */
    function getFunction(fnId) {
      if (!_.isArray(self.functions)) {
        return;
      }
      return _.find(self.functions, function (f) {
        return f.iD == fnId;
      });
    }

    /**
     * @name runFunction
     * @description Execute lambda function with given parameters
     * 
     * @param {string} action Lambda function name
     * @param {object} data A map of parameters {paramName : paramValue}
     * @param {object} params Additional query params
     * @returns promise
     */
    function runFunction(action, data, params) {
      if (!_.isString(action) && _.isEmpty(action)) {
        throw Error('Invalid action');
      }
      data = data;
      if (_.keys(params).length === 0) {
        params = '';
      }

      if (_.keys(data).length === 0) {
        data = '';
      }

      return Backand.fn.post(action, params, data);
    }


    /**
     * @name getParameters 
     * @description returns function parameters[All, By function ID]
     * if function_id is given, it returns that function's parameters else all
     * get paramters from $localStorage service
     * 
     * @param {integer} function_id A function ID which is an optional
     * @returns {array|object}
     */
    function getParameters(function_id) {
      var params;
      if (function_id) {
        params = $localStorage.parameters ? $localStorage.parameters[function_id] : undefined;
      } else {
        params = $localStorage.parameters || undefined;
      }
      return params;
    }


    /**
     * @name saveParameters 
     * @description stores function parameters[By function ID]
     * stores paramters in $localStorage service - in $localStorage.parameters
     * $localStorage.parameters : {
     *   f_1 : [{
     *     name : 'paramName',
     *     value : 'paramValue',
     *     key : param key - this is slugify title 
     *    }],
     *   f_2 : [],
     *   f_3 : []
     * }
     * where f_1,f_2,f_3 are function Ids
     * @param {integer} function_id A function ID which is an optional
     * @returns promise {array|object}
     */
    function saveParameters(fId, params) {
      var deffered = $q.defer();
      if (!fId || _.isEmpty(params)) {
        $timeout(function () {
          deffered.resolve(parameters);
        }, 1);
        return deffered.promise;
      }
      var parameters = getParameters();
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
    }


    /**
     * @description An helper function
     * user to prepare a list of parameters to be save in $localStorage
     * @param {array} list An array of parameters
     * @param {object} param A parameter to be saved 
     * @returns array of parameters
     */
    function storeParameter(list, param) {
      var pIdx = _.findIndex(list, { key: param.key });
      if (pIdx >= 0) {
        list[pIdx] = angular.extend(list[pIdx], param);
      } else {
        list.push(param);
      }

      return list;
    }

    /**
     * @name getRun
     * @description get run from $localStorage by functionID
     * 
     * @param {integer} fnId Function ID
     * @returns array |object
     */
    function getRun(fnId) {
      var r, runs = _.get($localStorage, 'runs');
      runs = runs || {};

      r = _.get(runs, fnId);

      return _.isArray(r) ? r : [];
    }

    /**
     * @name getRuns
     * @description get all runs from $localStorage
     * 
     * @returns array |object
     */
    function getRuns() {
      var r, runs = _.get($localStorage, 'runs');
      runs = runs || {};
      return runs;
    }

    /**
     * @name saveRun
     * @description stores result of lambda function execution in $localStorage.runs
     * $localStorage.runs = {
     *   f_1 : [{
     *    StatusCode : 200,
     *    executionTime : 4783683289,
     *    Payload : responseBody
     *   }],
     *   f_2 : [{....}]
     *   f_3 : [{....}]
     * }
     * where f_1,f_2,f_3 are function Ids
     * 
     * @param {integer} fId Lambda function Id 
     * @param {object} run Result of lambda function's execution
     * 
     * @returns void
     */
    function saveRun(fId, run) {
      var r, runs = _.get($localStorage, 'runs') || {};
      r = _.isArray(runs[fId]) ? runs[fId] : [];
      if (r.length >= 5) {
        r.unshift(run);
        r.length = 5;
      } else {
        r.unshift(run);
      }
      runs[fId] = r;
      $localStorage.runs = angular.copy(runs);
    }

    /**
     * @name enableSaveParams
     * @description Update boolean flag= true against a function
     * 
     * @param {integer} funcId function ID
     * @param {boolean} flag
     * @returns void
     */
    function enableSaveParams(funcId, flag) {
      var functions = $localStorage.functions || {};
      functions[funcId] = flag;
      $localStorage.functions = functions;
    }
    /**
     * @name isSaveParamEnable
     * @description checks if boolean flag = true against a function
     * 
     * @param {integer} funcId 
     * @returns 
     */
    function isSaveParamEnable(funcId) {
      return $localStorage.functions && $localStorage.functions[funcId];
    }

    //end of service  
  }
})();