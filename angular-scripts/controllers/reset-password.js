'use strict';

/**
 * @ngdoc function
 * @name mealimeterApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mealimeterApp
 */
angular.module('mealimeterApp')
    .controller('ResetPasswordCtrl', function($rootScope, $scope, $http) {

        $scope.resetPassword = function() {
            var emaildata = "email=" + $scope.useremail;
            var link = $rootScope.mealimeter;
            $http({
                method: "POST",
                url: link + "resetpassword",
                data: emaildata,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).then(function(response) {
                    console.log(response);
                    if (response.data.error == true) {
                        $scope.show = true;
                        $scope.error = response.data.description;
                    } else {
                        $scope.mshow = true;
                        $scope.message = response.data.description;
                        $scope.useremail = "";
                    }
                },

                function(error) {
                    console.log(error);
                });
        }
    });