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
  .module('mealimeterApp', ['ngAnimate','ngCookies','ngResource','ngRoute','ngSanitize','ngTouch','ngStorage'])
  .run(['$localStorage','$rootScope','$location',function($localStorage,$rootScope,$location){
    // $rootScope.mealimeter = "http://mealimeter.herokuapp.com/";
    // $rootScope.mealimeterassets = "http://mealimeter.herokuapp.com/";
    $rootScope.mealimeter = "http://localhost/mealimeter/index.php/";
    $rootScope.mealimeterassets = "http://localhost/mealimeter/";
    var path = function() { return $location.path();};
       $rootScope.$watch(path, function(newVal, oldVal){
         $rootScope.activetab = newVal;
       });
  }])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/pre-order.html',
        controller: 'preorderctrl',
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
