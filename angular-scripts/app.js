'use strict';

/**
 * @ngdoc overview
 * @name mealimeterApp
 * @description
 * # mealimeterApp
 *
 * Main module of the application.
 */
angular
  .module('mealimeterApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngStorage'
  ])
  .run(['$localStorage','$rootScope',function($localStorage,$rootScope){
    // $rootScope.mealimeter = "http://mealimeter.herokuapp.com/";
    // $rootScope.mealimeterassets = "http://mealimeter.herokuapp.com/";
    $rootScope.mealimeter = "http://localhost/mealimeter/index.php/";
    $rootScope.mealimeterassets = "http://localhost/mealimeter/";
  }])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/pre-order.html',
        controller: 'Pre-orderCtrl',
        controllerAs: 'main'
      })
      .when('/top-up', {
        templateUrl: 'views/top-up.html',
        controller: 'Top-upCtrl',
        controllerAs: 'about'
      })
      .when('/account', {
        templateUrl: 'views/account-settings.html',
        controller: 'Account-settingsCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
