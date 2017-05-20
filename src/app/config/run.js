/**
 * @ngdoc run
 * @name LambdaLauncher.run
 *
 * @module LambdaLauncher
 *
 * @description
 * application run block to configure setting when providers are ready
 * 
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';

  angular
    .module('LambdaLauncher')
    .run(run);
  /** @ngInject */
  function run(Auth, $rootScope, App) {
    //unregister lodadh lib from window. lodadh '_' is available as dependency
    window._ = undefined;
    Auth.getCurrentUser();
    Auth.AutherizeRoutes();
    //authenticate route before state transition
  
    var unregisterListner = $rootScope.$on('$stateChangeStart', function (event, to, toParams, from, fromParams) {
      var data = (to.$$route) ? to.$$route : to.data;
      App.isLoginRequired = data.requiresLogin;
      App.pageTitle = data.title;
      App.state = {
        to: to,
        toParams: toParams,
        from: from,
        fromParams: fromParams
      };
    });
    $rootScope.$on('$destroy', unregisterListner);
  }
})();
