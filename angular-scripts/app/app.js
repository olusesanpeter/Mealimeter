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
    .module('mealimeterApp', ['ngAnimate', 'ngCookies', 'ngResource', 'ngRoute', 'ngSanitize', 'ngTouch', 'ngStorage', 'ui.router'])
    .run(['$localStorage', '$rootScope', '$location', function($localStorage, $rootScope, $location) {
        $rootScope.mealimeter = "https://mealimeter.herokuapp.com/";
        $rootScope.mealimeterassets = "https://mealimeter.herokuapp.com/";

        $rootScope.mealimeter = "http://localhost/mealimeter-backend/mealimeter/index.php/";
        $rootScope.mealimeterassets = "http://localhost/mealimeter-backend/mealimeter/";

        // $rootScope.mealimeter = "http://localhost/mealimeter/index.php/";
        // $rootScope.mealimeter = "http://mealimeter.ng/api/index.php/";
        // $rootScope.mealimeterassets = "http://mealimeter.ng/api/";

        // $rootScope.mealimeter = "http://localhost/mealimeter_/index.php/";
        // $rootScope.mealimeterassets = "http://localhost/mealimeter_/";
        var path = function() { return $location.path(); };
        $rootScope.$watch(path, function(newVal, oldVal) {
            $rootScope.activetab = newVal;
        });
    }]).config(function($routeProvider) {
        $routeProvider
            .when('/guestlogin', {
                templateUrl: 'views/login.html',
                controller: 'GuestLoginCtrl',
                controllerAs: 'GL'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl',
                controllerAs: 'login'
            })
            .when('/home', {
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl',
                controllerAs: 'home'
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
            .when('/account-activation/:hash', {
                templateUrl: 'views/account-activation.html',
                controller: 'actCtrl',
                controllerAs: 'act'
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
            .when('/set-password', {
                templateUrl: 'views/set-password.html',
                controller: 'Set-passwordCtrl',
                controllerAs: 'set-password'
            })
            .otherwise({
                redirectTo: '/login'
            });
    }).directive('myTooltip', function(){
        return {
            restrict: 'A',
            link: function(scope, element){
                element.tooltip();
            }
        }
    }).directive('showtab',
    function () {
        return {
            link: function (scope, element, attrs) {
                element.click(function(e) {
                    e.preventDefault();
                    $(element).tab('show');
                });
            }
        };
    });