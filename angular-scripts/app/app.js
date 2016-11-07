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
    // $rootScope.mealimeter = "https://mealimeter.herokuapp.com/";
    // $rootScope.mealimeterassets = "https://mealimeter.herokuapp.com/";
    // $rootScope.mealimeter = "http://localhost/mealimeter-backend/mealimeter/index.php/";
    // $rootScope.mealimeterassets = "http://localhost/mealimeter-backend/mealimeter/";

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
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl',
        controllerAs: 'signup'
      })
      .when('/forgot-password', {
        templateUrl: 'views/forgot-password.html',
        controller: 'Forgot-passwordCtrl',
        controllerAs: 'forgot-password'
      })
      .when('/pre-order/:day', {
        templateUrl: 'views/pre-order.html',
        controller: 'preorderCtrl',
        controllerAs: 'pre-order'
      })
      .when('/top-up', {
        templateUrl: 'views/top-up.html',
        controller: 'Top-upCtrl',
        controllerAs: 'top-up'
      })
      .when('/account-details', {
        templateUrl: 'views/account-details.html',
        controller: 'Account-detailsCtrl',
        controllerAs: 'account-details'
      })
      .when('/checkout', {
        templateUrl: 'views/checkout.html',
        controller: 'CheckoutCtrl',
        controllerAs: 'checkout'
      })
      .when('/rating', {
        templateUrl: 'views/rating.html',
        controller: 'RatingCtrl',
        controllerAs: 'rating'
      })
      .when('/registration-successful', {
        templateUrl: 'views/registration-successful.html',
        controller: 'rsCtrl',
        controllerAs: 'rs'
      })
      .when('/account-activation', {
        templateUrl: 'views/account-activation.html',
        controller: 'actCtrl',
        controllerAs: 'rs'
      })
      .when('/set-password', {
        templateUrl: 'views/set-password.html',
        controller: 'Set-passwordCtrl',
        controllerAs: 'set-password'
      })
      .otherwise({
        redirectTo: '/login'
      });
  });
