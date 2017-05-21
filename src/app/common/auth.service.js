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
      ROUTE_HOME_STATE = ENV_CONFIG.ROUTE_HOME_STATE || 'dashboard.app';
    /**
     * @property currentUser
     * stores logged in user
     */
    self.currentUser = {};
    self.getCurrentUser = getCurrentUser;
    self.getSocialProviders = getSocialProviders;
    self.socialSignin = socialSignin;
    self.signin = signin;
    self.logout = logout;
    self.AutherizeRoutes = AutherizeRoutes;
    self.isLoggedIn = isLoggedIn;


    /**
     * @name getCurrentUser
     * @description get loggedIn user
     * redirects to ROUTE_HOME_STATE if valid user
     * 
     * @returns promise
     */
    function getCurrentUser() {
      return Backand.user.getUserDetails()
        .then(function (response) {
          var data = response.data;
          self.currentUser.details = data;
          $log.info('User -', data);
          if (data !== null) {
            self.currentUser.name = data.username;
            $state.transitionTo(ROUTE_HOME_STATE, { reload: true }, App.state.toParams);
          }
        });
    }

    /**
     * @name getSocialProviders
     * @description Fetch social providers from Backand
     * 
     * @returns promise
     */
    function getSocialProviders() {
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
    }


    /**
     * @name socialSignin
     * @description Signin to Backand with Social Providers[facebook, github ....]
     * 
     * @param {string} provider [facebook, github ....]
     * 
     * @returns promise
     */
    function socialSignin(provider) {
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
    }


    /**
     * @name signin
     * @description Signin to Backand with credentials
     * 
     * @param {object} User credentials[username,password] 
     * @returns promise
     */
    function signin(credentials) {
      var deffered = $q.defer();
      Backand
        .signin(credentials.username, credentials.password)
        .then(function (response) {
          var data = response.data || {};
          onSignin(data);
          deffered.resolve(data);
        }, function (error) {
          deffered.reject(error);
        });
      return deffered.promise;
    }

    /**
     * @name logout
     * @description logout from backand
     * 
     * @returns promise
     */
    function logout() {
      var deffered = $q.defer();
      Backand.signout().then(function (response) {
        clearSession();
        deffered.resolve(response.data);
      }, function (error) {
        clearSession();
        deffered.reject(error);
      });
      return deffered.promise;
    }
    /**
     * @description helper function to clear currentUser's clearSession
     */
    function clearSession() {
      delete $localStorage.BACKAND_user;
      angular.copy({}, self.currentUser);
    }


    /**
     * @description check if user is loggedIn
     * @returns boolean
     */
    function isLoggedIn() {
      return self.currentUser.name ? true : false;
    }

    /**
     * @name AutherizeRoutes
     * @description $stateChangeStart listner to apply logics before state complete
     * unregister listner $stateChangeStart
     * 
     */
    function AutherizeRoutes() {
      var unregisterListner = $rootScope.$on('$stateChangeStart', verifyRoute);
      $rootScope.$on('$destroy', unregisterListner);
    }

    function verifyRoute(event, to, toParams, from) {
      /**
       * @todo route authetication goes here
       */
    }

    function onSignin(data) {
      getCurrentUser();
    }

    //end of service  
  }
})();