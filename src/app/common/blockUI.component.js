/**
 * @ngdoc service
 * @name LambdaLauncher.service.blockUI
 *
 * @module LambdaLauncher
 *
 * @description
 * blockUI service is used to block UI
 * 
 * 
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';

  angular
    .module('LambdaLauncher')
    .service('blockUI', blockUI)
    .component('blockUi', {
      bindings: {},
      template: '<div class="block-ui-container" data-ng-show="$ctrl.isBlocking()"><div class="block-ui-overlay"></div><div class="block-ui-message-container" aria-live="assertive" aria-atomic="true"><div class="block-ui-message"><div class="sk-fading-circle"><div class="sk-circle1 sk-circle"></div><div class="sk-circle2 sk-circle"></div><div class="sk-circle3 sk-circle"></div><div class="sk-circle4 sk-circle"></div><div class="sk-circle5 sk-circle"></div><div class="sk-circle6 sk-circle"></div><div class="sk-circle7 sk-circle"></div><div class="sk-circle8 sk-circle"></div><div class="sk-circle9 sk-circle"></div><div class="sk-circle10 sk-circle"></div><div class="sk-circle11 sk-circle"></div><div class="sk-circle12 sk-circle"></div></div></div></div></div>',
      controller: ['blockUI', function (blockUI) {
        var $ctrl = this;
        $ctrl.$onInit = function () {
          $ctrl.isBlocking = blockUI.isBlocking;
        }
      }]
    });
  /** @ngInject */
  function blockUI() {
    var self = this, isBlocking;
    self.start = function () {
      isBlocking = true;
    };
    self.stop = function () {
      isBlocking = false;
    }

    self.isBlocking = function () {
      return isBlocking
    };
  }

})();
