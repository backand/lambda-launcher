/**
 * @ngdoc Directive
 * @name LambdaLauncher.directive.detectViewPort
 * @module LambdaLauncher
 *
 * @description
 * detectViewPort staring component with star
 * @TODO
 * onDetectViewPort callback
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function() {
    'use strict';
    angular
        .module('LambdaLauncher')
        .directive('detectViewPort', ['$detectViewPort', function($detectViewPort) {
            return {
                restrict: 'A',
                template: '',
                scope: {
                    onDetectViewPort: '&?',
                },
                link: function(scope, element, attributes) {
                    var viewPortWidth = angular.element(element).parent()[0].clientWidth;
                    $detectViewPort.setViewPortWidth(viewPortWidth);
                }
            };
        }])
        .service('$detectViewPort', [function() {
            var $this = this;
            $this.deviceType = '';
            $this.setViewPortWidth = function(viewPortWidth) {
                $this.viewPortWidth = viewPortWidth;
                determineDevice();
            };
            function determineDevice() {
                if ($this.viewPortWidth < 768) {
                    $this.deviceType = 'xs';
                } else if ($this.viewPortWidth >= 768 && $this.viewPortWidth < 992) {
                    $this.deviceType = 'sm';
                } else if ($this.viewPortWidth >= 992 && $this.viewPortWidth < 1200) {
                    $this.deviceType = 'md';
                } else if ($this.viewPortWidth >= 1200) {
                    $this.deviceType = 'lg';
                }
            }
        }])
})();
