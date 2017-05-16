/**
 * @ngdoc Component
 * @name LambdaLauncher.component.home
 *
 * @module LambdaLauncher
 *
 * @description
 * Home component - A application landing page
 *
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('LambdaLauncher')
    .component('home', {
      templateUrl: 'app/components/home/home.html',
      controller: [
        'Backand',
        '$log',
        '$state',
        '_',
        function (Backand, $log, $state, _) {
          var $ctrl = this;

          /**
           * component's lifeCycle hooks
           */
          $ctrl.$onInit = initialization;

          /**
           * public methods
           */
          $ctrl.socialSignin = socialSignin;
          /**
           * public properties
           */
          $ctrl.isSigning = false;
          /**
            * @function
            * @name initialization
            * @description
            * A component's lifeCycle hook which is called after all the controllers on an element have
            * been constructed and had their bindings initialized
            */
          function initialization() {
            getSocialProviders();
          }

          function getSocialProviders() {
            Backand
              .getSocialProviders()
              .then(function (response) {
                $ctrl.socialProviders = _.map(response, function (o, k) {
                  console.log(o);
                  return o;
                });
                $log.log('Social Provider collection', response);
              }, function (error) {
                //handle error
                $log.error(error);
              });
          }

          function socialSignin(provider) {
            $ctrl.isSigning = true;
            Backand
              .socialSignin(provider)
              .then(function (response) {
                $state.go('applications')
              }, function (error) {
                //handle error
                $log.error(error);
                $ctrl.isSigning = false;
              });
          }

        }]
    });
})();
