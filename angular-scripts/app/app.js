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
  .module('mealimeterApp', ['ngAnimate','ngCookies','ngResource','ngRoute','ngSanitize','ngTouch','ngStorage','ui.router'])
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
      .when('/login', {
        templateUrl: 'login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/signup', {
        templateUrl: 'signup.html',
        controller: 'SignupCtrl',
        controllerAs: 'signup'
      })
      .when('/forgot-password', {
        templateUrl: 'forgot-password.html',
        controller: 'Forgot-passwordCtrl',
        controllerAs: 'forgot-password'
      })
      .when('/pre-order/monday', {
        templateUrl: 'views/pre-order-monday.html',
        controller: 'preorderCtrl',
        controllerAs: 'pre-order'
      })
      .when('/pre-order/tuesday', {
        templateUrl: 'views/pre-order-tuesday.html',
        controller: 'preorderCtrl',
        controllerAs: 'pre-order'
      })
      .when('/pre-order/wednesday', {
        templateUrl: 'views/pre-order-wednesday.html',
        controller: 'preorderCtrl',
        controllerAs: 'pre-order'
      })
      .when('/pre-order/thursday', {
        templateUrl: 'views/pre-order-thursday.html',
        controller: 'preorderCtrl',
        controllerAs: 'pre-order'
      })
      .when('/pre-order/friday', {
        templateUrl: 'views/pre-order-friday.html',
        controller: 'preorderCtrl',
        controllerAs: 'pre-order'
      })
      .when('/top-up', {
        templateUrl: 'views/top-up.html',
        controller: 'Top-upCtrl',
        controllerAs: 'top-up'
      })
      .when('/account', {
        templateUrl: 'views/account-settings.html',
        controller: 'Account-settingsCtrl',
        controllerAs: 'account-settings'
      })
      .otherwise({
        redirectTo: '/login'
      });
  });