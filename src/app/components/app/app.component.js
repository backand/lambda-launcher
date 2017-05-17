/**
 * @ngdoc Component
 * @name LambdaLauncher.component.app
 *
 * @module LambdaLauncher
 *
 * @description
 * app component - A single app view
 *
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('LambdaLauncher')
    .component('app', {
      templateUrl: 'app/components/app/app.html',
      controller: [
        'Backand',
        '$log',
        '$state',
        function (Backand, $log, $state) {
          var $ctrl = this;

          /**
           * component's lifeCycle hooks
           */
          $ctrl.$onInit = initialization;

          /**
           * public methods
           */
          $ctrl.logout = logout;
          /**
           * public properties
           */

          /**
            * @function
            * @name initialization
            * @description
            * A component's lifeCycle hook which is called after all the controllers on an element have
            * been constructed and had their bindings initialized
            */
          function initialization() {
            getItems();
          }

          function logout() {
            Backand.signout().then(function () {
              $state.go('login');
            });
          }

          function getItems() {
            Backand.object.getList("items", {
              "pageSize": 20,
              "pageNumber": 1,
              "filter": [
              ],
              "sort": []
            }).then(function (response) {
              $ctrl.items = response.data;
            }, function (error) {
              console.log(error);
            });
          }

        }]
    })
})();
