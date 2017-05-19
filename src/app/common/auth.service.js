/**
 * @ngdoc service
 * @name LambdaLauncher.service.Auth
 *
 * @module LambdaLauncher
 *
 * @description
 * A service to manage user workflow [Authentication, Signup]
 * 
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';

  angular
    .module('LambdaLauncher')
    .service('Auth', AuthService);
  /** @ngInject */
  function AuthService($http, $localStorage, $rootScope, $state, Backand, $q, ENV_CONFIG, App) {
    var self = this,
      ROUTE_HOME_STATE = ENV_CONFIG.ROUTE_HOME_STATE || 'dashboard.app',
      ROUTE_LOGIN_STATE = ENV_CONFIG.ROUTE_LOGIN_STATE || 'login';

    self.getSocialProviders = function () {
      var deffered = $q.defer();
      Backand
        .getSocialProviders()
        .then(function (response) {
          var data = response.data || [];
          deffered.resolve(data);
        }, function (error) {
          deffered.reject(error);
        });
      return deffered.promise;
    };

    self.socialSignin = function (provider) {
      var deffered = $q.defer();
      Backand
        .socialSignin(provider)
        .then(function (response) {
          var data = response.data || {};
          onSignin(data);
          deffered.resolve(data);
        }, function (error) {
          deffered.reject(error);
        });
      return deffered.promise;
    };

    self.signin = function (credentials) {
      var deffered = $q.defer();
      Backand
        .signin(credentials)
        .then(function (response) {
          var data = response.data || {};
          onSignin(data);
          deffered.resolve(data);
        }, function (error) {
          deffered.reject(error);
        });
      return deffered.promise;
    }

    self.logout = function () {
      var deffered = $q.defer();
      Backand.signout().then(function (response) {
        delete $http.defaults.headers.common['Authorization'];
        delete $localStorage.Authorization;
        self.setAuthenticate(false);
        deffered.resolve(response.data);
      }, function (error) {
        deffered.reject(error);
      });
      return deffered.promise;
    };

    self.setAuthenticate = function (flag) {
      App.isAuthenticated = flag;
    };

    self.isAuthenticated = function () {
      var isAuthenticated, token = $localStorage.Authorization;
      isAuthenticated = token ? true : false;
      self.setAuthenticate(isAuthenticated);
      return isAuthenticated;
    };

    self.AutherizeRoutes = function () {
      var unregisterListner = $rootScope.$on('$stateChangeStart', verifyRoute);
      $rootScope.$on('$destroy', unregisterListner);
    };

    function verifyRoute(event, to, toParams, from) {
      var token, routeData, isAuthenticated;
      token = $localStorage.Authorization;
      isAuthenticated = token ? true : false;
      self.setAuthenticate(isAuthenticated);
      if (!to) {
        return false;
      }
      routeData = (to.$$route) ? to.$$route : to.data;
      if (routeData && routeData.requiresLogin === true) {
        if (!token) {
          //@todo Implement- token tokenHasExpired self.isTokenExpired(token)
          event.preventDefault();
          $state.go(ROUTE_LOGIN_STATE);
        }
      } else {
        if (from.url === '^' && to.name === ROUTE_LOGIN_STATE && token) {
          event.preventDefault();
          $state.go(ROUTE_HOME_STATE);
        }
      }
    }

    function onSignin(data) {
      var token;
      token = data.access_token;
      setToken(token);
    }

    function setToken(token) {
      $localStorage.Authorization = token;
    }

    //end of service  
  }
})();