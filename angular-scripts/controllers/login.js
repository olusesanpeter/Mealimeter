'use strict';

/**
 * @ngdoc function
 * @name mealimeterApp.controller:preorderctrl
 * @description
 * # preorderctrl
 * Controller of the mealimeterApp
 */
angular.module('mealimeterApp')
    .controller('LoginCtrl', ['$scope', '$http', '$rootScope', '$window', '$localStorage', '$location', '$routeParams', function($scope, $http, $rootScope, $window, $localStorage, $location, $routeParams) {

        $scope.loginAsGuest = function() {
            $localStorage.guest = true;
            $window.location.href = "#/pre-order";
        }

        if ($routeParams.guest == 'true') {
            if ($routeParams.birth == 'true') {
                $rootScope.birth = true;
                console.log("add birth");
            }
            $localStorage.guest = true;
            $window.location.href = "#/pre-order";
        }

        //////data from login
        if ($localStorage.guest != true) {
            if ($localStorage.data != undefined) {
                $window.location.href = "#/pre-order";
            }
        }
        $scope.logins = function(data) {
            var link = $rootScope.mealimeter;
            var logindata = "email=" + data.usernamefield + "&password=" + data.passwordfield;
            console.log(logindata);
            $http({
                method: "POST",
                url: link + "login",
                data: logindata,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).then(function(response) {
                console.log(response.data);
                $scope.show = false;
                if (response.data.data != undefined) {
                    if (response.data.error == false) {
                        delete $localStorage.guest;
                        console.log("Login Successful");
                        $localStorage.data = response.data;

                        $window.location.href = "#/pre-order";
                    }
                } else {
                    if (response.data.description == "Not Activated") {
                        $scope.error = 'Your account is not yet activated, Please check your email.';
                        $scope.show = true;

                    } else {
                        $scope.error = 'Incorrect Credentials. Please try again';
                        $scope.show = true;
                    }
                }
            }, function(error) {
                console.log(error);
            });
        };
    }]);