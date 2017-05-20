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
  function AuthService($http, $localStorage, $rootScope, $state, Backand, $q, ENV_CONFIG, $log, App) {
    var self = this,
      ROUTE_HOME_STATE = ENV_CONFIG.ROUTE_HOME_STATE || 'dashboard.app',
      ROUTE_LOGIN_STATE = ENV_CONFIG.ROUTE_LOGIN_STATE || 'login';

    self.currentUser = {};
    self.getCurrentUser = getCurrentUser;
    function getCurrentUser() {
      return Backand.user.getUserDetails(true)
        .then(function (response) {
          var data = response.data;
          self.currentUser.details = data;
          if (data !== null) {
            self.currentUser.name = data.username;
            $state.transitionTo(ROUTE_HOME_STATE, { reload: true }, App.state.toParams);
          }
        });
    }

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
        clearSession();
        deffered.resolve(response.data);
      }, function (error) {
        clearSession();
        deffered.reject(error);
      });
      return deffered.promise;
    };

    function clearSession() {
      delete $localStorage.BACKAND_user;
      angular.copy({}, self.currentUser);
    }
    self.isLoggedIn = function () {
      return self.currentUser.name ? true : false;
    };

    self.AutherizeRoutes = function () {
      var unregisterListner = $rootScope.$on('$stateChangeStart', verifyRoute);
      $rootScope.$on('$destroy', unregisterListner);
    };

    function verifyRoute(event, to, toParams, from) {
      /*var routeData;
      if (!to) {
        return false;
      }
      routeData = (to.$$route) ? to.$$route : to.data;
      if (routeData && routeData.requiresLogin === true) {
        if (!self.isLoggedIn()) {
          //@todo Implement- token tokenHasExpired self.isTokenExpired(token)
          event.preventDefault();
          $state.go(ROUTE_LOGIN_STATE);
        }
      } else {
        if (from.url === '^' && to.name === ROUTE_LOGIN_STATE && self.isLoggedIn()) {
          event.preventDefault();
          $state.go(ROUTE_HOME_STATE);
        } else if (to.name === ROUTE_LOGIN_STATE && self.isLoggedIn()) {
          event.preventDefault();
          $state.transitionTo(ROUTE_HOME_STATE, { reload: true });
        }
      }*/
    }

    function onSignin(data) {
      getCurrentUser();
    }

    //end of service  
  }
})();