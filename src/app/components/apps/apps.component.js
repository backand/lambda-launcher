/**
 * @ngdoc Component
 * @name LambdaLauncher.component.apps
 *
 * @module LambdaLauncher
 *
 * @description
 * apps component - List of apps
 *
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('LambdaLauncher')
    .component('apps', {
      templateUrl: 'app/components/apps/apps.html',
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
          $ctrl.viewApp = viewApp;
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

          function viewApp(item){
            $state.go('dashboard.app', {app_id : item.id});
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
