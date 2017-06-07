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
  function LambdaService(Backand, $q, $localStorage, _, $timeout) {
    var self = this;

    /**
     * Exposed bindable methods
     */
    self.getFunctions = getFunctions;
    self.runFunction = runFunction;
    self.getParameters = getParameters;
    self.saveParameters = saveParameters;
    self.getRuns = getRuns;
    self.saveRun = saveRun;


    /**
     * @name getFunctions
     * @description get all available lambda functions of current user
     * 
     * @param {object} params Addtional Query parameters
     * @returns promise
     */
    function getFunctions(params) {
      params = params || {};
      return Backand.invoke({
        method: 'GET',
        url: '/1/action/config',
        params: params
      })
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
      data = data ;
      if(_.keys(params).length === 0){
        params = '';
      }

      if(_.keys(data).length === 0){
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
      return function_id ? $localStorage.parameters[function_id] : $localStorage.parameters;
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
        throw Error('fId and params are required to store function parameters');
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
        list[pIdx] = angular.extend(param, list[pIdx]);
      } else {
        list.push(param);
      }

      return list;
    }

    /**
     * @name getRuns
     * @description get all runs from $localStorage
     * 
     * @returns array |object
     */
    function getRuns() {
      return $localStorage.runs || {};
    }

    /**
     * @name saveRun
     * @description stores result of lambda function execution in $localStorage.runs
     * $localStorage.runs = {
     *   f_1 : {
     *    StatusCode : 200,
     *    executionTime : 4783683289,
     *    Payload : responseBody
     *   },
     *   f_2 : {}
     *   f_3 : {}
     * }
     * where f_1,f_2,f_3 are function Ids
     * 
     * @param {integer} fId Lambda function Id 
     * @param {object} run Result of lambda function's execution
     * 
     * @returns void
     */
    function saveRun(fId, run) {
      var runs = getRuns();
      runs[fId] = run;
      $localStorage.runs = angular.copy(runs);
    }

    //end of service  
  }
})();