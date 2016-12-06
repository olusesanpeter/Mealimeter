'use strict';

/**
 * @ngdoc function
 * @name mealimeterApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mealimeterApp
 */
angular.module('mealimeterApp')
    .controller('Set-passwordCtrl', function($scope, $rootScope, $http, $routeParams) {

        if ($routeParams.reset != undefined) {
            $scope.token = $routeParams.reset;

            var resetdata = "resetToken=" + $scope.token;
            var link = $rootScope.mealimeter;
            $http({
                method: "POST",
                url: link + "checkresetpassword",
                data: resetdata,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).then(function(response) {
                    console.log(response);
                    if (response.data.error == true) {
                        $scope.show = true;
                        $scope.error = response.data.description;
                    } else {
                        $scope.email = response.data.email;
                    }
                },
                function(error) {
                    console.log(error);
                });

        } else {
            $scope.show = true;
            $scope.error = "Reset Link is invalid";
        }

        $scope.updatePassword = function() {
            $scope.mshow = false;
            if ($scope.password != $scope.confirmpassword) {
                $scope.mshow = true;
                $scope.message = "Passwords don't match";
            } else {

                var updatedata = "email=" + $scope.email + "&password=" + $scope.password + "&token=" + $scope.token;
                var link = $rootScope.mealimeter;

                $http({
                    method: "POST",
                    url: link + "updatepassword",
                    data: updatedata,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).then(function(response) {
                        console.log(response.data);
                        if (response.data.error == true) {
                            $scope.mshow = true;
                            $scope.message = response.data.description;
                        } else {
                            $scope.sshow = true;
                            $scope.success = response.data.description;
                        }
                    },
                    function(error) {
                        console.log(error);
                    });
            }
        }

    });