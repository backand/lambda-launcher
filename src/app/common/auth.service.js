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
  function AuthService($localStorage, $rootScope, $state, Backand, ENV_CONFIG, $log, App, Analytics) {
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
      if (!Backand.user) //in case Backand was created
        return;

      return Backand.user.getUserDetails()
        .then(function (response) {
          var data = response.data;
          self.currentUser.details = data;
          $log.info('User -', data);
          if (data !== null) {
            self.currentUser.name = data.username;
            if (ROUTE_HOME_STATE !== $state.current.name) {
              $state.transitionTo(ROUTE_HOME_STATE, { reload: true, app: $state.params.app }, App.state.toParams);
            }
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
      if (!Backand.getSocialProviders)
        return;

      return Backand.getSocialProviders()
        .then(function (response) {
          return response;
        });
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
      return Backand.socialSignin(provider)
        .then(function (response) {
          onSignin(response.data);
          return response.data;
        });
    }


    /**
     * @name signin
     * @description Signin to Backand with credentials
     * 
     * @param {object} User credentials[username,password] 
     * @returns promise
     */
    function signin(credentials) {
      return Backand.signin(credentials.username, credentials.password)
        .then(function (response) {
          onSignin(response.data);
          return response.data;
        });
    }

    /**
     * @name logout
     * @description logout from backand
     * 
     * @returns promise
     */
    function logout() {
      return Backand.signout().then(function (response) {
        clearSession();
        return response;
      }, function (error) {
        clearSession();
        return error;
      });
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
      Analytics.identify(data.fullName, data.username);
      getCurrentUser();
    }

    //end of service  
  }
})();