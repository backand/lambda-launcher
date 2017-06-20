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
    self.getRun = getRun;
    self.saveRun = saveRun;
    self.setParamsUpdated = setParamsUpdated;
    self.isParamsUpdated = isParamsUpdated;
    self.getFunction = getFunction;


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
        url: '1/action/config',
        params: params
      });
    }

    /**
     * @name getFunction
     * @description get function By iD
     * 
     * @param {object} params Addtional Query parameters
     * @returns promise
     */
    function getFunction(params) {
      params = params || {};
      if(!_.get(params, 'id')){
        throw Error('Function ID is required to get Function');
      }
      return Backand.invoke({
        method: 'GET',
        url: '1/action/config/'+params.id,
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
       var params ;
      if(function_id){
        params = $localStorage.parameters ? $localStorage.parameters[function_id] : undefined;
      }else {
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
        list[pIdx] = angular.extend(list[pIdx], param);
      } else {
        list.push(param);
      }

      return list;
    }

    /**
     * @name getRun
     * @description get all runs from $localStorage
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
      var r, runs  = _.get($localStorage, 'runs') || {};
      r = _.isArray(runs[fId]) ? runs[fId] : [];
      if(r.length >= 5){
        r.unshift(run);
        r.length =5;
      }else{
        r.push(run);
      }
      runs[fId] = r;
      $localStorage.runs = angular.copy(runs);
    }

    /**
     * @name setParamsUpdated
     * @description Update boolean flag= true against a function
     * if user has visited function params config page, Lets not restrcit him to take to param config page when he try to run function
     * 
     * @param {integer} funcId function ID
     * @returns void
     */
    function setParamsUpdated(funcId){
      var functions = $localStorage.functions || {};
      functions[funcId] = true;
      $localStorage.functions = functions;
    }
    /**
     * @name isParamsUpdated
     * @description checks if boolean flag = true against a function
     * 
     * @param {integer} funcId 
     * @returns 
     */
    function isParamsUpdated(funcId){
      return $localStorage.functions && $localStorage.functions[funcId];
    }

    //end of service  
  }
})();