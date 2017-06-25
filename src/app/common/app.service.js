/**
 * @ngdoc service
 * @name LambdaLauncher.service.App
 *
 * @module LambdaLauncher
 *
 * @description
 * App service is used to share data globaly
 * 
 * 
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';

  angular
    .module('LambdaLauncher')
    .service('App', AppService);
  /** @ngInject */
  function AppService($detectViewPort) {
    var self = this,
    functionDetailView = false;
    self.pageTitle = '';
    /**
     * social Providers
     */
    self.socialProviders = {
      google: {
        label: 'Google',
        className: 'google'
      },
      github: {
        label: 'Github AUth',
        className: 'github'
      },
      facebook: {
        label: 'Facebook',
        className: 'facebook'
      },
      twitter: {
        label: 'Twitter',
        className: 'twitter'
      },
      adfs: {
        label: 'Adfs',
        className: 'windows'
      },
      azuread: {
        label: 'Azure AD',
        className: 'windows'
      }
    }

    self.setDetailView = function(flag){
      functionDetailView = flag;
    };
    self.getDetailView = function(){
      return functionDetailView;
    };

    self.isSmallDevice = function(){
      return $detectViewPort.viewPortWidth <= 768;
    }
  }

})();
