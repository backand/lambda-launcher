/**
 * @ngdoc service
 * @name LambdaLauncher.service.Analytics
 *
 * @module LambdaLauncher
 *
 * @description
 * Analytics service is used to call segment
 * 
 * 
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';

  angular
    .module('LambdaLauncher')
    .service('Analytics', AnalyticsService);
  /** @ngInject */
  function AnalyticsService() {
    var self = this;

    self.identify = identify;
    self.track = track;

    /**
     *
     * @param fullName
     * @param email
     */
    function identify(fullName, email) {
      if (analytics) {
        analytics.identify(email, {
          name: fullName,
          email: email,
          createdAt: new Date().getTime()
        });
      }
    }

    /**
     *
     * @param eventName
     * @param eventObject
     */
    function track(eventName, eventObject) {
      if (analytics) {
        analytics.track(eventName, eventObject);
      }
    }

  }

})();
