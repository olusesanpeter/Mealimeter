'use strict';

/**
 * @ngdoc function
 * @name mealimeterApp.controller:preorderctrl
 * @description
 * # preorderctrl
 * Controller of the mealimeterApp
 */
angular.module('mealimeterApp')
    .controller('navbarCtrl', ['$scope', '$http', '$rootScope', '$window', '$localStorage', '$location', function($scope, $http, $rootScope, $window, $localStorage, $location) {
        if ($localStorage.data == undefined && $localStorage.guest == undefined) {
            $scope.show = false;
        } else {
            $scope.show = true;
            if ($localStorage.guest == true) {
                $scope.username = "guest";
            } else {
                $scope.username = $localStorage.data.data.username;
            }
        }

        $scope.signout = function() {
            delete $localStorage.data;
            delete $localStorage.cart;
            delete $localStorage.total;
            delete $localStorage.due;
            delete $localStorage.guest;

            $window.location.href = "#/login";
        }

        if ($localStorage.guest == true) {
            $scope.balance = 0;
        } else {
            var data = "token=" + $localStorage.data.data.token;
            var link = $rootScope.mealimeter;
            $http({
                method: "POST",
                url: link + "getBalance",
                data: data,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).then(function(result) {
                $scope.balance = result.data.balance;
            }, function(error) {
                console.log(error);
            });
        }

        $scope.gotoSignUp = function() {
            console.log("sign up");
            $window.location.href = "#/signup";
        }

        // console.log($scope.show);


    }]);