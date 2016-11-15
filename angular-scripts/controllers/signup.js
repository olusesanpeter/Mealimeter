'use strict';

/**
 * @ngdoc function
 * @name mealimeterApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mealimeterApp
 */
angular.module('mealimeterApp')
    .controller('SignupCtrl', ['$scope', '$routeParams', '$http', '$rootScope', '$window', '$localStorage', '$location', function($scope, $routeParams, $http, $rootScope, $window, $localStorage, $location) {
        console.log("Ref: ");
        console.log($routeParams.ref);
        $scope.refcodefield = $routeParams.ref;

        //////data from login
        var link = $rootScope.mealimeter;
        $http({
            method: "GET",
            url: link + "getCompanies"
        }).then(function(response) {
                console.log(response);
                $scope.companies = response.data.companies;
                console.log($scope.companies);
            },
            function(error) {
                console.log(error);
            });

        $scope.register = function(data) {
            console.log(data);
            var date = new Date(data.dobfield);
            data.datefield = date.getDate() + "/" + date.getMonth();
            console.log(data.datefield);
            if (data.companies == 'other') {
                var registerdata = "firstname=" + data.firstnamefield + "&lastname=" + data.lastnamefield + "&email=" + data.emailfield + "&phoneNo=" + data.phoneNofield + "&dob=" + data.datefield + "&sex=" + data.genderfield + "&password=" + data.passwordfield + "&password=" + data.passwordfield2 + "&refcode=" + $scope.refcodefield + "&officename=" + data.officename + "&officeaddress=" + data.officeaddress + "&officelocation=" + data.officelocation;
            } else {
                var registerdata = "firstname=" + data.firstnamefield + "&lastname=" + data.lastnamefield + "&email=" + data.emailfield + "&phoneNo=" + data.phoneNofield + "&dob=" + data.datefield + "&sex=" + data.genderfield + "&password=" + data.passwordfield + "&password=" + data.passwordfield2 + "&refcode=" + $scope.refcodefield + "&officeid=" + data.companies;
            }

            if (data.passwordfield != data.passwordfield2) {
                console.log("Registration Failed");
                $scope.error = "Passwords do not match, please try again"
                $scope.show = true;
            } else {
                $http({
                    method: "POST",
                    url: link + "register",
                    data: registerdata,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).then(function(response) {
                        console.log(response.data);
                        $scope.show = false;
                        if (response.data.result.error == false) {
                            console.log("Registration Successful");

                            if ($localStorage.guest == true) {
                                $rootScope.flashmessage = "You can now preorder";
                                $scope.guestlogin(data.emailfield, data.passwordfield);
                            } else {
                                setTimeout(function() {
                                    $window.location.href = "#/registration-successful";
                                }, 100);
                            }
                            $scope.show = false;
                        } else {
                            console.log("Registration Failed");
                            $scope.error = response.data.result.errors[0];
                            $scope.show = true;
                        }
                    },

                    function(error) {
                        console.log(error);
                    });
            }


        };

        $scope.guestlogin = function(username, password) {
            var link = $rootScope.mealimeter;
            var logindata = "email=" + username + "&password=" + password + "&guest=true";
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
                            $window.location.href = "#/checkout";
                        }
                    } else {
                        $scope.error = 'Something went wrong';
                        $scope.show = true;
                    }
                },
                function(error) {
                    console.log(error);
                });
        };

    }]);