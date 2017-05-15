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
    .component('dashboard', {
      templateUrl: 'app/components/dashboard/dashboard.html',
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
