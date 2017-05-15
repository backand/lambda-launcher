/**
 * @ngdoc Component
 * @name LambdaLauncher.component.footer
 *
 * @module LambdaLauncher
 *
 * @description
 * Footer component - A application footer
 *
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('LambdaLauncher')
    .component('appFooter', {
      templateUrl: 'app/components/footer/footer.html',
      controller: [
        '$log',
        function ($log) {
          var $ctrl = this;

          /**
           * component's lifeCycle hooks
           */
          $ctrl.$onInit = initialization;

          /**
           * public methods
           */
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
            $log.info('Footer component initialized');
          }
        }]
    })
})();
